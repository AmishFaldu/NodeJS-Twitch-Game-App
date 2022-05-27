import { MigrationInterface, QueryRunner } from 'typeorm';

export class initial1651410695244 implements MigrationInterface {
  name = 'initial1651410695244';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "game" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "igdbGameId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c6b67df32e9a5145d01e421995a" UNIQUE ("igdbGameId"), CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_eb02c8018d835ec846f165b2be" ON "game" ("name", "igdbGameId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_eb02c8018d835ec846f165b2be"`,
    );
    await queryRunner.query(`DROP TABLE "game"`);
  }
}
