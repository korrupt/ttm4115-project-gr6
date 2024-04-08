import { InjectDataSource } from "@nestjs/typeorm";
import { ChargerUserRepository, ChargerUser } from "@prosjekt/nest/charger/data-access/domain";
import { DataSource } from "typeorm";
import { ChargerUserEntity } from "../entity";
import { NotFoundException } from "@nestjs/common";


export class ChargerUserRepositoryImpl implements ChargerUserRepository {
  constructor(@InjectDataSource() private dataSource: DataSource){}

  public async findById(id: string): Promise<ChargerUser> {
    const found = await this.dataSource.getRepository(ChargerUserEntity)
      .findOneBy({ id });

      if (!found) {
        throw new NotFoundException();
      }

      return new ChargerUser({ id, has_reservation: false })
  }
}
