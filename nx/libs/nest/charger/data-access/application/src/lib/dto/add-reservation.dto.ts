import { AddReservationCommandProps } from "@prosjekt/shared/models";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsUUID } from "class-validator";
import { Moment } from "moment-timezone";
import moment = require("moment-timezone");


export class AddReservationDto implements Omit<AddReservationCommandProps, 'charger_id'> {
  @IsNotEmpty()
  // @IsDateString()
  @Transform((params) => moment.utc(params.value))
  from!: Moment;

  @IsNotEmpty()
  // @IsDateString({ strict: true })
  @Transform((params) => moment.utc(params.value))
  to!: Moment;

  @IsNotEmpty()
  @IsUUID('4')
  user_id!: string;
}
