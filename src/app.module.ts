import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { Rating } from './rating.entity';
import { RatingService } from './rating.service';
import { ReviewConsumer } from './review.consumer';

@Module({
    imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        TypeOrmModule.forFeature([ Rating ]),
    ],
    providers: [RatingService, ReviewConsumer],
})
export class AppModule {}
