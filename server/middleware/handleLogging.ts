import { Request, Response, NextFunction } from 'express';

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.originalUrl !== '/favicon.ico') {
        console.log('Logging route:', req.originalUrl);
    }
    next();
};
