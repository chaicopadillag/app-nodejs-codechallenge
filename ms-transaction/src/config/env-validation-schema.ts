import * as joi from 'joi';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}
export const envValidationSchema = joi.object({
  NODE_ENV: joi
    .string()
    .valid(...Object.values(Environment))
    .required(),

  KAFKA_BROKERS: joi.string().required(),
});
