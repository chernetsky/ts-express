import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import * as express from 'express';
import HttpException from '../exceptions/HttpException';

function processErrors(errors: ValidationError[]): string {
  let result = [];
  errors.forEach((error: ValidationError) => {
    if (error?.children?.length) {
      result = result.concat(processErrors(error.children));
    } else {
      result = result.concat(Object.values(error.constraints));
    }
  });

  return result.join('; ');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function validationMiddleware<T>(type: any, skipMissingProperties = false): express.RequestHandler {
  return (req, res, next) => {
    validate(plainToClass(type, req.body), { skipMissingProperties })
      .then((errors: ValidationError[]) => {
        // console.trace(errors);
        if (errors.length > 0) {
          const message = processErrors(errors);
          next(new HttpException(400, message));
        } else {
          next();
        }
      }).catch((err) => next(new HttpException(500, err.message)));
  };
}

export default validationMiddleware;
