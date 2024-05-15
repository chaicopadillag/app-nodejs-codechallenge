import * as joi from 'joi';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}
export const envValidationSchema = joi.object({
  // app
  NODE_ENV: joi
    .string()
    .valid(...Object.values(Environment))
    .required(),
  PORT: joi.number().port().required(),
  ALLOWED_ORIGINS: joi.string().required(),

  // ms client
  KAFKA_BROKERS: joi.string().required(),

  // cache redis
  REDIS_HOST: joi.string().required(),
  REDIS_PORT: joi.number().port().required(),
  REDIS_TTL: joi.number().required(),
});
