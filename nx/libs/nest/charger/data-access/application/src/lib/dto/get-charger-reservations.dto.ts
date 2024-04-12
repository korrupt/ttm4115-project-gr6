import { GetChargerReservationsQueryParams } from "@prosjekt/shared/models";
import { IsDateString, IsOptional } from "class-validator";


export class GetChargerReservationsDto implements GetChargerReservationsQueryParams {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsDateString()
  @IsOptional()
  to?: string;
}
