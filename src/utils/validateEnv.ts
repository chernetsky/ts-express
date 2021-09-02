import {
  cleanEnv, str, port,
} from 'envalid';

export default function validateEnv() {
  cleanEnv(process.env, {
    PORT: port(),
    JWT_SECRET: str(),
    POSTGRES_HOST: str(),
    POSTGRES_PORT: str(),
    POSTGRES_USER: str(),
    POSTGRES_PASSWORD: str(),
    POSTGRES_DB: str(),
  });
}
