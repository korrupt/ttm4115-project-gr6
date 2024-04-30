import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectDataSource } from "@nestjs/typeorm";
import { GetUserQuery, GetUserQueryResult } from "@prosjekt/shared/models";
import { DataSource } from "typeorm";
import { UserEntity } from "@prosjekt/nest/entity";



@QueryHandler(GetUserQuery)
export class GetUserQueryHandler implements IQueryHandler<GetUserQuery, GetUserQueryResult> {
  constructor(@InjectDataSource() private dataSource: DataSource){}

  async execute(query: GetUserQuery): Promise<GetUserQueryResult> {
    return this.dataSource.getRepository(UserEntity)
      .find();
  }
}
