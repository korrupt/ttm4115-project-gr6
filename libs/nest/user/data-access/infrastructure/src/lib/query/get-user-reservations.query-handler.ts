import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectDataSource } from "@nestjs/typeorm";
import { GetUserReservationsQuery, GetUserReservationsQueryResult } from "@prosjekt/shared/models";
import { DataSource } from "typeorm";
import { NotFoundException } from "@nestjs/common";
import { TimeSlotEntity, UserEntity } from "@prosjekt/nest/entity";



@QueryHandler(GetUserReservationsQuery)
export class GetUserReservationsQueryHandler implements IQueryHandler<GetUserReservationsQuery, GetUserReservationsQueryResult> {
  constructor(@InjectDataSource() private dataSource: DataSource){}

  async execute(query: GetUserReservationsQuery): Promise<GetUserReservationsQueryResult> {
    const user = await this.dataSource.getRepository(UserEntity).findOneBy({ id: query.user_id });

    if (!user) {
      throw new NotFoundException();
    }

    return this.dataSource.getRepository(TimeSlotEntity)
      .findBy({
        user_id: query.user_id
      });
  }
}
