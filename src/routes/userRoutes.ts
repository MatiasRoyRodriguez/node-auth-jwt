import express from 'express';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '../controllers/usersController';
import { authenticationToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', authenticationToken, createUser);
router.get('/', authenticationToken, getAllUsers);
router.get('/:id', authenticationToken, getUserById);
router.put('/:id', authenticationToken, updateUser);
router.delete('/:id', authenticationToken, deleteUser);

export default router;
