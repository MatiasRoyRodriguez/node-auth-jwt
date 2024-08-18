import { NextFunction, Request, Response } from "express";
import { comparePassword, hashPassword } from "../services/password.service";
import prisma from '../models/user';
import { generateToken } from "../services/auth.service";
import { validateEmailAndPassword } from "../services/validation.service";

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;
    const validationError = validateEmailAndPassword(email, password);
    if (validationError) {
        res.status(400).json({ message: validationError });
        return;
    }

    try {
        const hashedPassword = await hashPassword(password);
        const user = await prisma.create({
            data: { email, password: hashedPassword }
        });

        const token = generateToken(user);
        res.status(201).json({ token });
    } catch (error: any) {
        if (error.code === 'P2002' && error.meta.target.includes('email')) {
            res.status(400).json({ message: 'El email ingresado ya existe' });
        } else {
            next(error);
        }
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;
    const validationError = validateEmailAndPassword(email, password);
    if (validationError) {
        res.status(400).json({ message: validationError });
        return;
    }

    try {
        const user = await prisma.findUnique({ where: { email } });
        if (!user || !(await comparePassword(password, user.password))) {
            res.status(401).json({ error: 'Credenciales inválidas' });
            return;
        }

        const token = generateToken(user);
        res.status(200).json({ token });
    } catch (error) {
        next(error);
    }
};
