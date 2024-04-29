import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  GetChargerByIdQuery,
  GetChargerByIdQueryResult,
} from '@prosjekt/shared/models';
import { DataSource } from 'typeorm';
import { ChargerEntity } from '../entity';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetChargerByIdQuery)
export class GetChargerByIdQueryHandler
  implements IQueryHandler<GetChargerByIdQuery, GetChargerByIdQueryResult>
{
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async execute(
    query: GetChargerByIdQuery,
  ): Promise<GetChargerByIdQueryResult> {
    const { id } = query;

    const found = await this.dataSource
      .getRepository(ChargerEntity)
      .createQueryBuilder('c')
      .select([
        'c.id as id',
        'c.name as name',
        'c.status as status',
        'ST_AsGeoJSON(c.location)::jsonb as location',
        'array_to_json(c.charger_types) as charger_types'
      ])
      .where('c.id = :id', { id })
      .getRawOne();

    if (!found) {
      throw new NotFoundException()
    }

    return found;
  }
}
