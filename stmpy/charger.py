from stmpy import Machine, Driver
import paho.mqtt.client as mqtt
from threading import Thread
import json
import random

id = 1
broker, port = "ipsen.no", 1883
 
class Charger:
    def __init__(self):
        self.electricity = 0
 
    def msg(self, message):
        print(message)

    def msg_cloud(self, type, message):
        print(message)
        msg = {"msg": message}
        json_msg = json.dumps(msg)
        self.mqtt_client.publish(f"charger/{id}/{type}", json_msg)

    def start_measure_electricity(self):
        self.electricity = 0

    def end_measure_electricity(self):
        self.electricity = random.randint(10,150)
        self.msg_cloud("charge", self.electricity)

    
 
 
class MQTT_Client:
    def __init__(self):
        self.id = id
        self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1)
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
 
 
    def on_connect(self, client, userdata, flags, rc):
        print("on_connect(): {}".format(mqtt.connack_string(rc)))
 
    def on_message(self, client, userdata, msg):
        topic = msg.topic
        payload_str = msg.payload.decode("utf-8")
        msg_content = ""
        try:
            msg_content = json.loads(payload_str)['msg']
        except json.JSONDecodeError:
            print("Failed to decode JSON")
        print(msg_content)
        if (msg_content == "start_charging"):
            self.stm_driver.send("start", "charger_stm")
        elif (msg_content == "stop_charging"):
            self.stm_driver.send("end", "charger_stm")
        elif (msg_content == "charger_down"):
            self.stm_driver.send("down", "charger_stm")
        elif (msg_content == "repair"):
            self.stm_driver.send("repaired", "charger_stm")
        #For debug and simulation purposes, event_disconnected, event_car_charged, event_self_down are implemented with MQTT
        elif (msg_content == "event_disconnected"):
            self.stm_driver.send("disconnected", "charger_stm")
        elif (msg_content == "event_car_charged"):
            self.stm_driver.send("fully_charged", "charger_stm")
        elif (msg_content == "event_self_down"):
            self.stm_driver.send("self_down", "charger_stm")
        else:
            print(topic, msg_content)
 
    def start(self, broker, port):
        print("Connecting to {}:{}".format(broker, port))
        self.client.connect(broker, port)
        self.client.subscribe(f"cmd/charger/{self.id}/#")
 
        try:
            # line below should not have the () after the function!
            thread = Thread(target=self.client.loop_forever)
            thread.start()
        except KeyboardInterrupt:
            print("Interrupted")
            self.client.disconnect()
 
 
s_idle = {
    'name': 'idle',
    'entry': 'msg_cloud("status","idle")'
}

s_active = {
    'name': 'active',
    'entry': 'msg_cloud("status","charging");start_measure_electricity()',
    'exit': 'end_measure_electricity();'

}

s_down = {
    'name': 'down',
    'entry': 'msg_cloud("status","out_of_order")',
    'start': 'msg_cloud("status","charger_out_of_order")',
    'exit' : 'msg_cloud("status","charger_repaired")'
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

t_fully_charged = {'trigger': 'fully_charged',
          'source': 'active',
         'target': 'idle',
         'effect': 'msg_cloud("status", "car_fully_charged")'
         }

t_disconnected = {'trigger': 'disconnected',
          'source': 'active',
         'target': 'idle',
         'effect': 'msg_cloud("status", "charger_disconnected")'
         }


t_idle_down = {'trigger': 'down',
                'source': 'idle',
               'target': 'down'
               }

t_idle_self_down = {'trigger': 'self_down',
                'source': 'idle',
               'target': 'down'
               }

t_active_down = {'trigger': 'down',
                'source': 'active',
                 'target': 'down'
                 }

t_active_self_down = {'trigger': 'self_down',
                'source': 'active',
                 'target': 'down'
                 }


t_repaired = {'trigger': 'repaired', 
              'source': 'down',
              'target': 'idle'
              }

 
charger = Charger()
charger_machine =  Machine('charger_stm', [t_init, t_start, t_end, t_disconnected, t_fully_charged, t_idle_down, t_active_down, t_idle_self_down, t_active_self_down, t_repaired], charger, [s_idle, s_active, s_down])
charger.stm = charger_machine
 
driver = Driver()
driver.add_machine(charger_machine)
 
myclient = MQTT_Client()
charger.mqtt_client = myclient.client
myclient.stm_driver = driver
 
driver.start()
myclient.start(broker, port)
 
driver.start()