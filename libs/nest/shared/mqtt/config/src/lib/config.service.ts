import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MqttOptions, Transport,  } from "@nestjs/microservices";


@Injectable()
export class MqttConfigService {
  constructor(private conf: ConfigService){}

  get HOST(): string {
    return this.conf.get('mqtt.HOST')!;
  }

  get PORT(): number {
    return this.conf.get('mqtt.PORT')!;
  }

  get ID(): string {
    return this.conf.get('mqtt.ID')!;
  }

  public createConfig(): MqttOptions {
    return {
      transport: Transport.MQTT,
      options: {
        hostname: this.HOST,
        port: this.PORT,
        protocol: 'mqtt',
        serializer: {
          serialize(value, options) {
              return value.data
          },
        }
      },
    }
  }
}
