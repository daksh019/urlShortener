import * as Joi from '@hapi/joi';

export const schema = Joi.object({
  BASE_URL: Joi.string().default('http://localhost:3000'),
});
