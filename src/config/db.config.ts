export const dbConfig = {
    type: 'mysql' as const,
    host: process.env.DB_HOST || 'reviews_mysql',
    port: 3306,
    username: process.env.DB_USER || 'db_user',
    password: process.env.DB_PASSWORD || 'db_password',
    database: process.env.DB_NAME || 'db_name',
};
