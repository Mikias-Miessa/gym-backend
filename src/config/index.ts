import dotenv from 'dotenv';
dotenv.config();

export default {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || 'replace-this',
};
