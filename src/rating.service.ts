import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from './rating.entity';
import { Repository } from 'typeorm';
import Redis from 'ioredis';

@Injectable()
export class RatingService {
    private redis = new Redis({ host: 'redis' });

    constructor(
        @InjectRepository(Rating)
        private repo: Repository<Rating>,
    ) {}

    async updateRating(productId: string, rating: number) {
        let record = await this.repo.findOne({ where: { productId } });

        if (!record) {
            record = this.repo.create({
                productId,
                averageRating: rating,
                reviewsCount: 1,
            });
        } else {
            record.averageRating =
                (record.averageRating * record.reviewsCount + rating) /
                (record.reviewsCount + 1);

            record.reviewsCount++;
        }

        await this.repo.save(record);
        await this.redis.set(
            `product_rating_${productId}`,
            JSON.stringify(record),
        );
    }

    async deleteReview(productId: string, rating: number) {
        const record = await this.repo.findOne({ where: { productId } });
        if (!record) return;

        if (record.reviewsCount <= 1) {
            await this.repo.delete(productId);
            await this.redis.del(`product_rating_${productId}`);
            return;
        }

        record.averageRating =
            (record.averageRating * record.reviewsCount - rating) /
            (record.reviewsCount - 1);

        record.reviewsCount--;

        await this.repo.save(record);
        await this.redis.set(
            `product_rating_${productId}`,
            JSON.stringify(record),
        );
    }
}
