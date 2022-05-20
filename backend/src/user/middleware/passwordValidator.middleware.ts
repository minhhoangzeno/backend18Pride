import { NextFunction, Request, Response } from 'express';
import { digitPassword, maxCharacterPassword, messagePasswordValidator, minCharacterPassword, statusCodeErrorUser } from 'src/constant';
import { HttpExceptError } from 'src/helpers/error';

var passwordValidator = require('password-validator');
var schema = new passwordValidator();
schema
  .is().min(minCharacterPassword)
  .is().max(maxCharacterPassword)
  .has().uppercase()
  .has().lowercase()
  .has().digits(digitPassword)
  .has().not().spaces()

export function PassWordValidatorMiddleware(req: Request, res: Response, next: NextFunction) {
  let password = req.body.password;
  if (password) {
    const isValidatePassword = schema.validate(password, { details: true });
    if (isValidatePassword.length > 0) {
      throw new HttpExceptError(messagePasswordValidator, statusCodeErrorUser);
    } else {
      next()
    }
  }
}