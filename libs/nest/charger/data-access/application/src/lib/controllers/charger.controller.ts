import { Controller, Get } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { GetAllChargersQuery } from "../query";


@Controller('charger')
export class ChargerController {
  constructor(private queryBus: QueryBus){}

  @Get()
  public async getAllChargers() {
    return this.queryBus.execute(new GetAllChargersQuery({}))
  }
}
