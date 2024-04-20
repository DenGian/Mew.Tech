import { Request, Response, NextFunction } from "express";

export const handleError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).render("error", {
    errorMessage: err.message,
    errorStack: err.stack,
  });
  res.render("error", {
    message: err.message, // Message from the Error object
    error: {
      status: res.statusCode,
      stack: err.stack,
    },
  });
};
