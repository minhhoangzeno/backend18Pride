import nodemailer = require("nodemailer");

export const emailConfig = {
  user: 'noreply18PRIDE@gmail.com',
  pass: '18PRIDEnoreply'
}

export const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

//password validator
export const messagePasswordValidator = 'Your password is low';
export const messageEmailUnquie = 'Your email is same';
export const messagePasswordInvaild = 'Password is not invalid';
export const messageEmailInvaild = 'Email is not invalid';
export const messageVideoUnquie = 'Video is unquie';
export const messageVideoValid = 'Video Youtube is invalid'
export const messageNotFound = 'Not Found!'
export const statusCodeErrorUser = 422;

export const minCharacterPassword = 8;
export const maxCharacterPassword = 100;
export const digitPassword = 1;

//jwt sceret 
export const jwtSeceret = 'Dalecarnegie'



