import { MigrationInterface, QueryRunner } from "typeorm";

export class Rating1764685731536 implements MigrationInterface {
    name = 'Rating1764685731536'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`rating\` (\`productId\` varchar(255) NOT NULL, \`averageRating\` float NOT NULL, \`reviewsCount\` int NOT NULL, PRIMARY KEY (\`productId\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`rating\``);
    }

}
