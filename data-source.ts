import { DataSource } from 'typeorm';
import { dbConfig } from './src/config/db.config';
import { Rating } from './src/rating.entity';

export default new DataSource({
    ...dbConfig,
    type: 'mysql',
    entities: [Rating],
    migrations: ['src/migrations/*.ts'],
});
