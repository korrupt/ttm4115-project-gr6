from stmpy import Machine, Drvier
import logging
import paho.mqtt.client as mqtt

class Car:
    def _init_(self):
        self.client = mqtt.Client(callback_api_version=mqtt.CallbackAPIVersion.VERSION1)
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
    
    def on_connect(self, client userdata, flags, rc):
        print("on_connect(): {}".format(mqtt.connack_string(rc)))