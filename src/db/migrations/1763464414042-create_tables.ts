import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1763464414042 implements MigrationInterface {
  name = 'CreateTables1763464414042';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_features" DROP CONSTRAINT "FK_product_features_product"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_images" DROP CONSTRAINT "FK_product_images_product"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_features" RENAME COLUMN "product_id" TO "productId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_images" RENAME COLUMN "product_id" TO "productId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" RENAME COLUMN "quantity" TO "available_quantity"`,
    );
    await queryRunner.query(`ALTER TABLE "product_images" DROP COLUMN "url"`);
    await queryRunner.query(
      `ALTER TABLE "product_images" ADD "url" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_images" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_images" ADD "description" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_features" ADD CONSTRAINT "FK_49464d72e80a6b447ce674e25bd" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_images" ADD CONSTRAINT "FK_b367708bf720c8dd62fc6833161" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_images" DROP CONSTRAINT "FK_b367708bf720c8dd62fc6833161"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_features" DROP CONSTRAINT "FK_49464d72e80a6b447ce674e25bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_images" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_images" ADD "description" character varying(100) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "product_images" DROP COLUMN "url"`);
    await queryRunner.query(
      `ALTER TABLE "product_images" ADD "url" character varying(100) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" RENAME COLUMN "available_quantity" TO "quantity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_images" RENAME COLUMN "productId" TO "product_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_features" RENAME COLUMN "productId" TO "product_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_images" ADD CONSTRAINT "FK_product_images_product" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_features" ADD CONSTRAINT "FK_product_features_product" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
