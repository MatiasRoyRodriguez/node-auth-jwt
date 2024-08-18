import { Request, Response, NextFunction } from "express";
import { hashPassword } from '../services/password.service';
import prisma from '../models/user';
import { validateEmailAndPassword } from "../services/validation.service";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
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

        res.status(201).json(user);
    } catch (error: any) {
        if (error.code === 'P2002' && error.meta.target.includes('email')) {
            res.status(400).json({ message: 'El email ingresado ya existe' });
        } else {
            next(error);
        }
    }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await prisma.findMany();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.id);

    try {
        const user = await prisma.findUnique({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.id);
    const { email, password } = req.body;

    try {
        const dataToUpdate: any = { ...req.body };
        if (password) {
            dataToUpdate.password = await hashPassword(password);
        }

        const user = await prisma.update({
            where: { id: userId },
            data: dataToUpdate
        });
        
        res.status(200).json(user);
    } catch (error: any) {
        if (error.code === 'P2002' && error.meta.target.includes('email')) {
            res.status(400).json({ error: 'El email ingresado ya existe' });
        } else if (error.code === 'P2025') {
            res.status(404).json({ error: 'Usuario no encontrado' });
        } else {
            next(error);
        }
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.id);

    try {
        await prisma.delete({ where: { id: userId } });
        res.status(200).json({ message: `El usuario ${userId} ha sido eliminado` });
    } catch (error) {
        next(error);
    }
};
