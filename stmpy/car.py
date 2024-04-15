from stmpy import Machine, Driver
import logging
import paho.mqtt.client as mqtt
from threading import Thread

broker, port = "ibsen.no", 1883

class Car:
    def on_init(self):
        pass

    def send_mqtt_start_charge(self):
        self.stm.send("start_charge")
        logging.info("Charging started")
        self.mqtt_client.publish("cmd/charger/id/start")

    def send_mqtt_fully_charged(self):
        self.stm.send("fully_charged")
        logging.info("Fully charged")
        self.mqtt_client.publish("cmd/charger/id/stop")


t0 = {"source": "initial", "target": "not_charge", "effect": "on_init"}

t1 = {
    "trigger": "start_charge",
    "source": "not_charge",
    "target": "charge",
}

t2 = {
    "trigger": "fully_charged",
    "source": "charge",
    "target": "not_charge",
}


t3 = {
    "trigger": "message",
    "source": "charge",
    "target": "not_charge",
}



class MQTT_Client:
    def _init_(self):
        self.client = mqtt.Client(callback_api_version=mqtt.CallbackAPIVersion.VERSION1)
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
    
    def on_connect(self, client, userdata, flags, rc):
        print("on_connect(): {}".format(mqtt.connack_string(rc)))

    def on_message(self, client, userdata, msg):
        #print("on_message(): topic: {}".format(msg.topic))
        #self.stm_driver.send("message", "tick_tock")
        topic = msg.topic
        self.stm_driver.send(topic, "car")

    def start(self, broker, port):

        print("Connecting to {}:{}".format(broker, port))
        self.client.connect(broker, port)

        self.client.subscribe("cmd/car/#")

        try:
            # line below should not have the () after the function!
            thread = Thread(target=self.client.loop_forever)
            thread.start()
        except KeyboardInterrupt:
            print("Interrupted")
            self.client.disconnect()





logger = logging.getLogger('stmpy.Driver')
logger.setLevel(logging.INFO)
ch = logging.StreamHandler()
ch.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
ch.setFormatter(formatter)
logger.addHandler(ch)

logger = logging.getLogger('stmpy.Machine')
logger.setLevel(logging.INFO)
ch = logging.StreamHandler()
ch.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
ch.setFormatter(formatter)
logger.addHandler(ch)

logging.getLogger().setLevel(logging.INFO)


car = Car()
car_machine = Machine(transitions=[t0, t1, t2, t3], obj=car, name="car")
car.stm = car_machine

driver = Driver()
driver.add_machine(car_machine)

myclient = MQTT_Client()
car.mqtt_client = myclient.client
myclient.stm_driver = driver

driver.start()
myclient.start(broker, port)



def test_machine():
    car.send_mqtt_start_charge()
    car.send_mqtt_fully_charged()
    print("Done")

test_machine()
driver.stop()