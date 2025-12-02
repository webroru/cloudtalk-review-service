import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { RatingService } from './rating.service';
import { connect, Channel } from 'amqplib';

@Injectable()
export class ReviewConsumer implements OnModuleInit {
    private logger = new Logger('ReviewConsumer');
    private channel: Channel;

    constructor(private ratingService: RatingService) {}

    async onModuleInit() {
        // Подключение к RabbitMQ
        const connection = await connect(process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672');
        this.channel = await connection.createChannel();

        const queueName = process.env.QUEUE_NAME || 'reviews_queue';
        await this.channel.assertQueue(queueName, { durable: true });

        this.logger.log(`Listening on queue: ${queueName}`);

        // Ограничение на количество параллельных сообщений
        const prefetch = parseInt(process.env.CONCURRENCY || '8', 10);
        await this.channel.prefetch(prefetch);

        this.channel.consume(
            queueName,
            async (msg) => {
                if (!msg) return;
                try {
                    const payload = JSON.parse(msg.content.toString());
                    const type = msg.properties.headers?.type;

                    if (!type) {
                        this.logger.warn('Message missing type header, skipping');
                        this.channel.ack(msg);
                        return;
                    }

                    await this.handleEvent(payload, type);
                    this.channel.ack(msg);
                } catch (err) {
                    this.logger.error('Failed to process message', err);
                    this.channel.nack(msg, false, false); // DLQ
                }
            },
            { noAck: false },
        );
    }

    private async handleEvent(payload: any, type: string) {
        switch (type) {
            case 'App\\Domain\\Review\\Event\\ReviewCreatedEvent':
                await this.ratingService.updateRating(payload.productId, payload.rating);
                this.logger.log(`Processed ReviewCreatedEvent for product ${payload.productId}`);
                break;

            case 'App\\Domain\\Review\\Event\\ReviewDeletedEvent':
                await this.ratingService.deleteReview(payload.productId, payload.rating);
                this.logger.log(`Processed ReviewDeletedEvent for product ${payload.productId}`);
                break;

            case 'App\\Domain\\Review\\Event\\ReviewUpdatedEvent':
                // Для обновления нам нужно знать старый рейтинг
                await this.ratingService.deleteReview(payload.productId, payload.oldRating);
                await this.ratingService.updateRating(payload.productId, payload.newRating);
                this.logger.log(`Processed ReviewUpdatedEvent for product ${payload.productId}`);
                break;

            default:
                this.logger.warn(`Unknown event type: ${type}`);
        }
    }
}
