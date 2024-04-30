import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectDataSource } from "@nestjs/typeorm";
import { GetUserByIdQuery, GetUserByIdQueryResult } from "@prosjekt/shared/models";
import { DataSource } from "typeorm";
import { UserEntity } from "@prosjekt/nest/entity";
import { NotFoundException } from "@nestjs/common";



@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler implements IQueryHandler<GetUserByIdQuery, GetUserByIdQueryResult> {
  constructor(@InjectDataSource() private dataSource: DataSource){}

  async execute(query: GetUserByIdQuery): Promise<GetUserByIdQueryResult> {
    const { user_id } = query;

    const found = await this.dataSource.getRepository(UserEntity)
      .findOneBy({ id: user_id });

    if (!found) {
      throw new NotFoundException();
    }

    return found;
  }
}
