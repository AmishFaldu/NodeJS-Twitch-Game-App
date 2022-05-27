import { MigrationInterface, QueryRunner } from 'typeorm';

export class userFavouriteGameRelation1651493731376
  implements MigrationInterface
{
  name = 'userFavouriteGameRelation1651493731376';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "game" ADD "userId" uuid`);
    await queryRunner.query(
      `CREATE INDEX "IDX_a8106c0a84d70ecfc3358301c5" ON "game" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "game" ADD CONSTRAINT "FK_a8106c0a84d70ecfc3358301c54" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "game" DROP CONSTRAINT "FK_a8106c0a84d70ecfc3358301c54"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a8106c0a84d70ecfc3358301c5"`,
    );
    await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "userId"`);
  }
}
