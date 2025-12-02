export const redisConfig = {
    host: process.env.REDIS_HOST || 'redis',
    db: Number(process.env.REDIS_DB ?? 0),
};
