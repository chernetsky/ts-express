import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import * as express from 'express';
import HttpException from '../exceptions/HttpException';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function validationMiddleware<T>(type: any, skipMissingProperties = false): express.RequestHandler {
  return (req, res, next) => {
    validate(plainToClass(type, req.body), { skipMissingProperties, forbidUnknownValues: true })
      .then((errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
          next(new HttpException(400, message));
        } else {
          next();
        }
      }).catch((err) => next(new HttpException(500, err.message)));
  };
}

function processErrors(errors: ValidationError[]) {
  const messages: string[] = [];

  if (errors.length > 0) {
    const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
  }
}

export default validationMiddleware;
