from stmpy import Machine, Driver
import paho.mqtt.client as mqtt
from threading import Thread
 
broker, port = "ipsen.no", 1883
 
class Charger:
    def __init__(self):
        self.electricity = 0
 
    def msg(self, message):
        print(message)

    def msg_cloud(self, message):
        print(message)

    def start_measure_electricity(self):
        self.electricity = 0

    def end_measure_electricity(self):
        self.electricity = 15
        return self.electricity
    
 
 
class MQTT_Client_1:
    def __init__(self):
        self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1)
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
 
 
    def on_connect(self, client, userdata, flags, rc):
        print("on_connect(): {}".format(mqtt.connack_string(rc)))
 
    def on_message(self, client, userdata, msg):
        topic = msg.topic
        if (topic == "charger/start"):
            self.stm_driver.send("start", "charger_stm")
        elif (topic == "charger/end"):
            self.stm_driver.send("end", "charger_stm")
        elif (topic == "charger/down"):
            self.stm_driver.send("down", "charger_stm")
        elif (topic == "charger/repaired"):
            self.stm_driver.send("repaired", "charger_stm")
        else:
            print(topic)
 
    def start(self, broker, port):
        print("Connecting to {}:{}".format(broker, port))
        self.client.connect(broker, port)
        self.client.subscribe("charger/+")
 
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
charger_machine =  Machine('charger_stm', [t_init, t_start, t_end, t_idle_down, t_active_down, t_repaired], charger, [s_idle, s_active, s_down])
charger.stm = charger_machine
 
driver = Driver()
driver.add_machine(charger_machine)
 
myclient = MQTT_Client_1()
charger.mqtt_client = myclient.client
myclient.stm_driver = driver
 
driver.start()
myclient.start(broker, port)
 
driver.start()