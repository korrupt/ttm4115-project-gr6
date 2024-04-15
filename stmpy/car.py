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
        #self.mqtt_client.publish("Start charge")

    def send_mqtt_fully_charged(self):
        self.stm.send("fully_charged")
        logging.info("Fully charged")
        #self.mqtt_client.publish("Car is fully charged")

    def send_mqtt_error(self):
        self.stm.send("error")
        logging.info("Error from the car")
        #self.mqtt_client.publish("Error")


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
    "trigger": "error",
    "source": "charge",
    "target": "not_charge",
}

t4 = {
    "trigger": "message",
    "source": "charge",
    "target": "not_charge",
}



class MQTT_client:
    def _init_(self):
        self.client = mqtt.Client(callback_api_version=mqtt.CallbackAPIVersion.VERSION1)
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
    
    def on_connect(self, client, userdata, flags, rc):
        print("on_connect(): {}".format(mqtt.connack_string(rc)))

    def on_message(self, client, userdata, msg):
        print("on_message(): topic: {}".format(msg.topic))
        self.stm_driver.send("message", "tick_tock")

    def start(self, broker, port):

        print("Connecting to {}:{}".format(broker, port))
        self.client.connect(broker, port)

        #Finn et topic å subscribe til
        self.client.subscribe("")

        try:
            # line below should not have the () after the function!
            thread = Thread(target=self.client.loop_forever)
            thread.start()
        except KeyboardInterrupt:
            print("Interrupted")
            self.client.disconnect()


car = Car()
car_machine = Machine(transitions=[t0, t1, t2, t3, t4], obj=car, name="car")
car.stm = car_machine


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
    
driver = Driver()
driver.add_machine(car_machine)
driver.start()

def test_machine():
    car.send_mqtt_start_charge()
    car.send_mqtt_fully_charged()
    car.send_mqtt_error()
    print("Done")

test_machine()