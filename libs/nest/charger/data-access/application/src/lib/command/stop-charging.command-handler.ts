import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ClientMqtt } from "@nestjs/microservices";
import { ChargerRepository, ChargerStatus, ChargerTokens } from "@prosjekt/nest/charger/data-access/domain";
import { MQTT_CLIENT_PROXY_KEY } from "@prosjekt/nest/shared/mqtt/data-access";
import { StartChargingCommand } from "./start-charging.command-handler";
import { lastValueFrom } from "rxjs";
import { TopicMessage } from "../charger-command";

export class StopChargingCommand {
  constructor(readonly id: string){}
}


@CommandHandler(StopChargingCommand)
export class StopChargingCommandCommandHandler implements ICommandHandler<StopChargingCommand, void> {
  constructor(
    @Inject(ChargerTokens.CHARGER_REPOSITORY) private charger: ChargerRepository,
    @Inject(MQTT_CLIENT_PROXY_KEY) private client: ClientMqtt
  ){}

  async execute(command: StartChargingCommand): Promise<void> {
    const charger = await this.charger.findById(command.id);

    charger.updateStatus(ChargerStatus.charging);

    await this.charger.save(charger);

    charger.commit();

    await lastValueFrom(this.client.send(`cmd/charger/${command.id}`, { msg: TopicMessage.STOP_CHARGING }))
  }
}
