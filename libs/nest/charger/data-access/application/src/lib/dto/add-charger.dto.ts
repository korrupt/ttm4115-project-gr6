import { AddChargerCommandPropsModel, ChargerType } from '@prosjekt/shared/models';
import { ArrayMaxSize, ArrayMinSize, IsEnum, IsNotEmpty, IsString } from 'class-validator'


export class AddChargerDto implements AddChargerCommandPropsModel {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsEnum(ChargerType, { each: true })
  charger_types!: ChargerType[];

  @IsNotEmpty()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  location!: [number, number];
}
