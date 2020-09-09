import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserFullName1599576747371 implements MigrationInterface {
  name = 'UserFullName1599576747371';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.renameColumn('user', 'name', 'fullName');
  }
  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.renameColumn('user', 'fullName', 'name');
  }
}
