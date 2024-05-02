from stmpy import Machine, Driver
import paho.mqtt.client as mqtt
from threading import Thread
 
broker, port = "ipsen.no", 1883
 
class Quiz:
 
    def msg(self, message):
        print(message)
 
 
class MQTT_Client_1:
    def __init__(self):
        self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1)
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
 
 
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
 
 
s0 = {
    'name': 'newround',
}
 
s1 = {
    'name': 'wait',
}
 
t0 = {
    'source': 'newround',
    'trigger': 'quiz_master_message',
    'target': 'wait',
    'effect': 'start_timer("timer", 5000); msg("Waiting for message")'
}
 
t1 = {
    'source': 'wait',
    'trigger': 'ack',
    'target': 'newround',
    'effect': 'stop_timer("timer"); msg("Round over. Starting new round")'
}
 
t2 = {
    'source': 'wait',
    'trigger': 'timer',
    'target': 'newround',
    'effect': 'msg("Time ran out. Starting new round")'
}
 
t3 = {
    'source': 'newround',
    'trigger': 'ack',
    'target': 'newround'
}
 
t4 = {
    'source': 'initial',
    'target': 'newround',
    'effect': 'msg("New round. Waiting for quiz master")'
}
 
t5 = {
    'source': 'wait',
    'target': 'wait',
    'trigger': 'quiz_master_message'
}
 
t6 = {
    'source': 'wait',
    'target': 'wait',
    'trigger': 'quiz_master_message'
}
 
tick = Quiz()
tick_tock_machine =  Machine('quiz', [t0, t1, t2, t3, t4, t5], tick, [s0, s1])
tick.stm = tick_tock_machine
 
driver = Driver()
driver.add_machine(tick_tock_machine)
 
myclient = MQTT_Client_1()
tick.mqtt_client = myclient.client
myclient.stm_driver = driver
 
driver.start()
myclient.start(broker, port)
 
driver.start()