import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Rating } from '../rating.entity';
import { dbConfig } from './db.config';

export const typeOrmConfig: TypeOrmModuleOptions = {
    ...dbConfig,
    entities: [Rating],
    synchronize: false,
};
