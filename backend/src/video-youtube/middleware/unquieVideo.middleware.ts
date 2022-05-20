import { NextFunction, Request, Response } from 'express';

export function UnquieVideoMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(req.body);
  // req.on('data', (data) => {
  //   console.log(data.join())
  // })

  // req.on('data', (data) => {
  //   console.log(data)
  // })
  // next()
  // res.on('finish',(data) => {
  //   console.log(data)
  // })
}