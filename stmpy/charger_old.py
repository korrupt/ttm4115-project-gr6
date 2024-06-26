from stmpy import Machine, Driver
import logging
import paho.mqtt.client as mqtt
from threading import Thread

broker, port = "ipsen.no", 1883

class Charger:
    def __init__(self):
        self.electricity = 0

    def msg(self, message):
        print(message)

    def chargingStarted(self):
        self.stm.send("start")
        logging.info("Charging started")

    def chargingEnded(self):
        self.stm.send("end")
        logging.info("Charging ended")

    def chargerDown(self):
        self.stm.send("down")
        logging.info("Charger down")

    def chargerDownWhileInUse(self):
        pass

    def chargerRepaired(self):
        self.stm.send("repaired")
        logging.info("Charger fixed")

    def start_measure_electricity(self):
        self.electricity = 0

    def end_measure_electricity(self):
        self.electricity = 15
        return self.electricity
    
    def msg_cloud(self, msg_from_stm):
        if (msg_from_stm == "idle"):
            print("idle_msg")
        elif (msg_from_stm == "active"):
            print("active_msg")
        elif (msg_from_stm == "done"):
            print("done_msg_with_consumption", self.electricity)
        elif (msg_from_stm == "down"):
            print("down_msg")
        elif (msg_from_stm == "repaired"):
            print("repaired_msg")
        else:
            print("error, no msg of this type")


class MQTT_Client_1:
    def __init__(self):
        self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1)
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_log = self.on_log

    def on_log(self, client, userdata, level, buf):
        print("Log:", buf)

 
 
    def on_connect(self, client, userdata, flags, rc):
        print("on_connect(): {}".format(mqtt.connack_string(rc)))
 
    def on_message(self, client, userdata, msg):
        topic = msg.topic
        print("test")
        if (topic == "quiz/master"):
            self.stm_driver.send("quiz_master_message", "quiz")
        else:
            self.stm_driver.send("ack", "quiz")
 
 
    def start(self, broker, port):
        print("Connecting to {}:{}".format(broker, port))
        self.client.connect(broker, port)
        self.client.subscribe("quiz/+")
 
        try:
            # line below should not have the () after the function!
            thread = Thread(target=self.client.loop_forever)
            thread.start()
        except KeyboardInterrupt:
            print("Interrupted")
            self.client.disconnect()

s_idle = {
    'name': 'idle',
    'entry': 'msg_cloud("idle")'
}

s_active = {
    'name': 'active',
    'entry': 'msg_cloud("active");start_measure_electricity()',
    'exit': 'end_measure_electricity();msg_cloud("done")'

}

s_down = {
    'name': 'down',
    'entry': 'msg_cloud("down")',
    'exit' : 'msg_cloud("repaired")'
}

t_init = {'source': 'initial',
        'target': 'idle'
      }

t_start = {'trigger': 'start',
          'source': 'idle',
          'target': 'active'
          }

t_end = {'trigger': 'end',
          'source': 'active',
         'target': 'idle'
         }

t_idle_down = {'trigger': 'down',
                'source': 'idle',
               'target': 'down'
               }

t_active_down = {'trigger': 'down',
                'source': 'active',
                 'target': 'down'
                 }

t_repaired = {'trigger': 'repaired', 
              'source': 'down',
              'target': 'idle'
              }



charger = Charger()
stm_charger = Machine(name='stm_charger', states=[s_idle, s_active, s_down] ,transitions=[t_init, t_start, t_end, t_idle_down, t_active_down, t_repaired], obj=charger)
charger.stm = stm_charger

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
driver.add_machine(stm_charger)

myclient = MQTT_Client_1()
charger.mqtt_client = myclient.client
myclient.stm_driver = driver

driver.start()

def test_charger():
    charger.chargingStarted()
    charger.chargingEnded()
    charger.chargerDown()
    charger.chargerRepaired()
    charger.chargingStarted()
    charger.chargerDown()
    print("Testing_cycle_down")
# test_charger()