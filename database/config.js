import dtenv from 'dotenv';

dtenv.config();

const dbConfig = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    timestamps: true,
    underscored: true,
  },
  logging: false,
  dialectOptions: {
    ssl: {
      require: true, // Exige SSL
      rejectUnauthorized: false, // Pode ser útil em casos com certificados autoassinados
    },
  },
};

export default dbConfig;