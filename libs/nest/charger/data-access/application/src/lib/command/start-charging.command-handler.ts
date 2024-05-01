import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ClientMqtt } from "@nestjs/microservices";
import { ChargerRepository, ChargerStatus, ChargerTokens } from "@prosjekt/nest/charger/data-access/domain";
import { MQTT_CLIENT_PROXY_KEY } from "@prosjekt/nest/shared/mqtt/data-access";
import { lastValueFrom, switchMap, timer } from "rxjs";
import { TopicMessage } from "../charger-command";

const CAR_ID = '1';

export class StartChargingCommand {
  constructor(readonly id: string){}
}

@CommandHandler(StartChargingCommand)
export class StartChargingCommandCommandHandler implements ICommandHandler<StartChargingCommand, void> {
  constructor(
    @Inject(ChargerTokens.CHARGER_REPOSITORY) private charger: ChargerRepository,
    @Inject(MQTT_CLIENT_PROXY_KEY) private client: ClientMqtt
  ){}

  async execute(command: StartChargingCommand): Promise<void> {
    const charger = await this.charger.findById(command.id);

    if (charger.status === "out_of_order") {
      await lastValueFrom(this.client.send(`cmd/car/1`, { msg: 'charger_error' }))
    } else {
      charger.updateStatus(ChargerStatus.charging);

      await this.charger.save(charger);

      charger.commit();

      await lastValueFrom(this.client.send(`cmd/charger/${command.id}`, { msg: TopicMessage.START_CHARGING }));

      // await lastValueFrom(timer(10e3).pipe(switchMap(() => this.client.send(`cmd/car/1`, { msg: 'car_fully_charged' }))));
    }
  }
}
