import 'dotenv/config';
import Sequelize from 'sequelize';
import pg from 'pg';



const url = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_tuMSXGOBs2R7@ep-curly-moon-au8kbrjm-pooler.c-10.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require';


const sequelize = url
    ? new Sequelize(url, {
        dialect: 'postgres',
        dialectModule: pg,
        dialectOptions: {
            ssl: { require: true, rejectUnauthorized: false }
        },
        pool: { max: 2 },
        logging: false
    })
    : new Sequelize(
        process.env.DB_NAME || 'objetos_perdidos_db',
        process.env.DB_USER || 'postgres',
        process.env.DB_PASSWORD || 'ulima',
        {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            dialect: 'postgres',
            dialectModule: pg,
            logging: false
        }
    );

export default sequelize;
