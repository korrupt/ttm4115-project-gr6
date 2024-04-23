import json
from stmpy import Machine, Driver
import logging
import paho.mqtt.client as mqtt
from threading import Thread

broker, port = "ipsen.no", 1883

class Car:
    def on_init(self):
        pass

    def send_mqtt_fully_charged(self):
        self.stm.send("fully_charged")
        logging.info("Fully charged")
        self.mqtt_client.publish("cmd/charger/id/stop")

    def print_state(self, type, msg):
        print(msg)

t0 = {"source": "initial", "target": "not_charge", "effect": "on_init"}

t1 = {
    "trigger": "start_charge",
    "source": "not_charge",
    "target": "charge",
    "effect": 'print_state("type", "Moved to state charge")'
}

t2 = {
    "trigger": "fully_charged",
    "source": "charge",
    "target": "not_charge",
    "effect": "print_state('type', 'Moved to state not_charge')"
}

t3 = {
    "trigger": "stop",
    "source": "charge",
    "target": "not_charge",
    "effect": "print_state('type', 'Moved to state not_charge')"
}

t4 = {
    "trigger": "disconnected",
    "source": "charge",
    "target": "not_charge",
    "effect": "print_state('type', 'moved to state not_charge')"
}


class MQTT_Client:
    def __init__(self):
        #self.client = mqtt.Client(callback_api_version=mqtt.CallbackAPIVersion.VERSION1)
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
    
    def on_connect(self, client, userdata, flags, rc):
        print("on_connect(): {}".format(mqtt.connack_string(rc)))

    def on_message(self, client, userdata, msg):
        print("message received")
        try:
            topic = msg.topic
            payload = msg.payload.decode("utf-8")
            data = json.loads(payload)
        except Exception as e:
            print("Error decoding or parsing message:", e)
        print("topic: ", topic, "data:", data["msg"])
        if topic == "cmd/car/id" and data["msg"] == "start":
            print("hei")
            self.stm_driver.send("start_charge", "car")
        elif topic == "cmd/car/id" and data["msg"] == "stop":
            self.stm_driver.send("stop", "car")  
        elif topic == "cmd/car/id" and data["msg"] == "disconnected":
            self.stm_driver.send("disconnected", "car")    


    def start(self, broker, port):
        print("Connecting to {}:{}".format(broker, port))
        self.client.connect(broker, port)
        self.client.subscribe("cmd/car/id")
        self.client.subscribe("cmd/charger/id")
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
car_machine = Machine(transitions=[t0, t1, t2, t3, t4], obj=car, name="car")
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

#test_machine()