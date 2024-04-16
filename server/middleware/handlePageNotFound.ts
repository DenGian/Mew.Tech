import { Request, Response, NextFunction } from 'express';

export const pageNotFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).render('404');
};
