import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrderAndOrderItemRelationship1770250423302
  implements MigrationInterface
{
  name = 'OrderAndOrderItemRelationship1770250423302';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "orders_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "sale_price" integer NOT NULL, "orderId" uuid, CONSTRAINT "PK_0fd87b790d35ac255b17f6a3bd1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_items" ADD CONSTRAINT "FK_dbffa0e72d9de7f8b08c83df153" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders_items" DROP CONSTRAINT "FK_dbffa0e72d9de7f8b08c83df153"`,
    );
    await queryRunner.query(`DROP TABLE "orders_items"`);
  }
}
