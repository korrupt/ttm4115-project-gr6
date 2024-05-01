import { Body, Controller, Delete, Get, Inject, OnModuleInit, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetAllChargersQuery } from '../query';
import { AddChargerDto, AddReservationDto, GetChargerReservationsDto } from '../dto';
import { AddChargerCommand, RemoveChargerCommand, UpdateChargerStatusCommand } from '../command';
import { AddReservationCommand, GetChargerByIdQuery, GetChargerReservationsQuery, RemoveReservationCommand } from '@prosjekt/shared/models';
import { JwtGuard } from '@prosjekt/nest/auth/data-access/application';
import { MQTT_CLIENT_PROXY_KEY } from '@prosjekt/nest/shared/mqtt/data-access';
import { ClientMqtt, Ctx, EventPattern, MessagePattern, MqttContext, Payload, Transport } from '@nestjs/microservices';
import { TopicMessage } from '../charger-command';
import { lastValueFrom, switchMap, timer } from 'rxjs';
import { StartChargingCommand } from '../command/start-charging.command-handler';
import { StopChargingCommand } from '../command/stop-charging.command-handler';


@Controller('charger')
export class ChargerController implements OnModuleInit {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
    @Inject(MQTT_CLIENT_PROXY_KEY) private client: ClientMqtt
  ) {

  }


  async onModuleInit() {
    try {
      await this.client.connect();
      console.log("MQTT connected");
    } catch (e) {
      console.log(e);
    }
  }

  @Post('test')
  public async test() {
    this.client.emit('test', 'test').subscribe();
  }

  @EventPattern('car/+', Transport.MQTT)
  public async handleCarCommand(@Payload() payload: any, @Ctx() ctx: MqttContext) {
    const id = ctx.getTopic().split('/')[1];

    try {
      if (payload.msg) {
        const command: TopicMessage = payload.msg;

        switch (command) {
          case TopicMessage.START_CHARGING: {
            await this.commandBus.execute(new StartChargingCommand(payload.charger_id));
          } break;
          case TopicMessage.STOP_CHARGING: {
            await this.commandBus.execute(new StopChargingCommand(payload.charger_id));
          } break;
        }
      }
    } catch (e) {
      console.log(e);
    }


  }

  // @MessagePattern('charger/+/status')

  @EventPattern('charger/+/status', Transport.MQTT)
  public async handleChargerStatusChange(@Payload() payload: any, @Ctx() ctx: MqttContext) {
    const id = ctx.getTopic().split('/')[1];

    try {
      await this.commandBus.execute(new UpdateChargerStatusCommand(id, payload.msg))
    } catch (error) {
      console.log(error);
    }
  }

  @EventPattern('charger/+', Transport.MQTT)
  public async handleCharger(@Payload() payload: any, @Ctx() ctx: MqttContext) {
    const id = ctx.getTopic().split('/')[1];

    try {
      switch (payload.msg) {
        case 'car_fully_charged': {
          await lastValueFrom(this.client.send(`cmd/car/1`, { msg: 'car_fully_charged' }));
        } break;
        case 'charger_disconnected': {
          await lastValueFrom(this.client.send(`cmd/car/1`, { msg: 'charger_disconnected' }));
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  @UseGuards(JwtGuard)
  public async getAllChargers() {
    return this.queryBus.execute(new GetAllChargersQuery({}));
  }

  @Post()
  @UseGuards(JwtGuard)
  public async addCharger(@Body() dto: AddChargerDto) {
    return this.commandBus.execute(new AddChargerCommand({ name: dto.name, charger_types: dto.charger_types, location: dto.location }))
  }

  @Get(':charger_id')
  @UseGuards(JwtGuard)
  public async getChargerById(@Param('charger_id') charger_id: string) {
    return this.queryBus.execute(new GetChargerByIdQuery({ id: charger_id }));
  }

  @Delete(':charger_id')
  @UseGuards(JwtGuard)
  public async removeCharger(@Param('charger_id') charger_id: string) {
    return this.commandBus.execute(new RemoveChargerCommand(charger_id));
  }

  @Post(':charger_id/reservation')
  @UseGuards(JwtGuard)
  public async addReservation(
    @Param('charger_id') charger_id: string,
    @Body() dto: AddReservationDto
    ) {
      return this.commandBus.execute(new AddReservationCommand({
        ...dto,
        charger_id,
      }));
  }

  @Get(':charger_id/reservation')
  @UseGuards(JwtGuard)
  public async getChargerReservations(
      @Param('charger_id') charger_id: string,
      @Query() params: GetChargerReservationsDto,
    ) {
    return this.queryBus.execute(new GetChargerReservationsQuery({ ...params, charger_id }));
  }

  @Delete(':charger_id/reservation/:reservation_id')
  @UseGuards(JwtGuard)
  public async removeReservation(@Param('reservation_id') reservation_id: string) {
    return this.commandBus.execute(new RemoveReservationCommand(reservation_id))
  }

}
