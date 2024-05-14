import { Request, Response, NextFunction } from 'express';

export const validateRegisterForm = (req: Request, res: Response, next: NextFunction) => {
    const { email, username, password } = req.body;
    if (!email || !isValidEmail(email)) {
        return res.status(400).send('Invalid email address');
    }
    if (!username) {
        return res.status(400).send('Username is required');
    }
    if (!password || password.length < 8) {
        return res.status(400).send('Password must be at least 8 characters long');
    }
    next();
};

const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
