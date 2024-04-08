import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  GetAllChargersQuery,
  GetAllChargersQueryResult,
} from '@prosjekt/shared/models';
import { DataSource } from 'typeorm';
import { ChargerEntity } from '../entity';

@QueryHandler(GetAllChargersQuery)
export class GetAllChargersQueryHandler
  implements IQueryHandler<GetAllChargersQuery, GetAllChargersQueryResult>
{
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async execute(
    query: GetAllChargersQuery,
  ): Promise<GetAllChargersQueryResult> {
    return this.dataSource
      .getRepository(ChargerEntity)
      .createQueryBuilder('c')
      .select(['c.id', 'c.name', 'c.location'])
      .getRawMany();
  }
}
