import json
from stmpy import Machine, Driver
import logging
import paho.mqtt.client as mqtt
from threading import Thread
import ipywidgets as widgets
from IPython.display import display

broker, port = "ipsen.no", 1883
id = 1
class Car:
    def on_init(self):
        self.button_stop_charge = widgets.Button(description="Stop charging")
        self.button_stop_charge.on_click(self.on_button_stop_charge)
        self.button_start_charge = widgets.Button(description="Start charging")
        self.button_start_charge.on_click(self.on_button_start_charge)
        display(self.button_start_charge, self.button_stop_charge)

    def on_button_stop_charge(self, b):
        self.stm.send('stop_charging')

    def on_button_start_charge(self, b):
        self.stm.send('start_charging')

    def on_button_terminate(self, b):
        self.stm.driver.stop()

    def send_mqtt_start_charge(self):
        logging.info("Charging started")
        data = {
        "msg": "start_charging"
        }
        msg = json.dumps(data)
        self.mqtt_client.publish("car/" + str(id), msg)

    def send_mqtt_stop_charge(self):
        logging.info("Charging stopped")
        data = {
        "msg": "stop_charging"
        }
        msg = json.dumps(data)
        self.mqtt_client.publish("car/" + str(id), msg)

    def print_state(self, type, msg):
        print(msg)

t0 = {"source": "initial", "target": "not_charge", "effect": "on_init"}

t1 = {
    "trigger": "start_charging",
    "source": "not_charge",
    "target": "charge",
    "effect": 'print_state("type", "Moved to state charge");send_mqtt_start_charge()'
}

t2 = {
    "trigger": "car_fully_charged",
    "source": "charge",
    "target": "not_charge",
    "effect": "print_state('type', 'Moved to state not_charge')"
}

t3 = {
    "trigger": "stop_charging",
    "source": "charge",
    "target": "not_charge",
    "effect": "print_state('type', 'Moved to state not_charge');send_mqtt_stop_charge()"
}

t4 = {
    "trigger": "charger_disconnected",
    "source": "charge",
    "target": "not_charge",
    "effect": "print_state('type', 'moved to state not_charge')"
}

t5 = {
    "trigger": "charging_error",
    "source": "charge",
    "target": "not_charge",
    "effect": "print_state('type', 'Moved to state not_charge')"
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
        if topic == "cmd/car/"+ str(id) and data["msg"] == "start_charging":
            self.stm_driver.send("start_charging", "car")
        elif topic == "cmd/car/"+ str(id) and data["msg"] == "stop_charging":
            self.stm_driver.send("stop_charging", "car")
        elif topic == "cmd/car/"+ str(id) and data["msg"] == "car_fully_charged":
            self.stm_driver.send("car_fully_charged", "car") 
        elif topic == "cmd/car/"+ str(id) and data["msg"] == "charger_disconnected":
            self.stm_driver.send("charger_disconnected", "car")  
        elif topic == "cmd/car/"+ str(id) and data["msg"] == "charger_error":
            self.stm_driver.send("charging_error", "car")  


    def start(self, broker, port):
        print("Connecting to {}:{}".format(broker, port))
        self.client.connect(broker, port)
        self.client.subscribe("cmd/car/"+ str(id))
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
car_machine = Machine(transitions=[t0, t1, t2, t3, t4, t5], obj=car, name="car")
car.stm = car_machine

driver = Driver()
driver.add_machine(car_machine)

myclient = MQTT_Client()
car.mqtt_client = myclient.client
myclient.stm_driver = driver

driver.start()
myclient.start(broker, port)