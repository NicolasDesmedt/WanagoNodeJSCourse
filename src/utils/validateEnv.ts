import { cleanEnv, str, port } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    POSTGRES_HOST: str(),
    POSTGRES_PORT: port(),
    POSTGRES_DB: str(),
    POSTGRES_PASSWORD: str(),
    POSTGRES_USER: str(),
    PORT: port(),
    TWO_FACTOR_AUTHENTICATION_APP_NAME: str(),
  });
};

export default validateEnv;
