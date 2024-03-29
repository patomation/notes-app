import * as dotenv from 'dotenv';
dotenv.config();

export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'XXXXXXXXXXXXXXXXXXXXXXXX',
};

export const JWT_EXPIRES_IN = '365d'; // super secure
