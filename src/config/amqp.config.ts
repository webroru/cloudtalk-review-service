export const amqpConfig = {
    host: process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672',
    queue: process.env.QUEUE_NAME || 'messages',
    concurrency: Number(process.env.CONCURRENCY ?? '8'),
};
