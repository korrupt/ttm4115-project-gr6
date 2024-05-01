
import { registerAs } from "@nestjs/config";

export default registerAs('mqtt', () => ({
  HOST: process.env['MQTT_HOST'],
  PORT: parseInt(process.env['MQTT_PORT']!),
  ID: process.env['MQTT_ID'],
}))
