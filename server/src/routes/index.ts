import { Router } from 'express';
import authRoutes from './auth.routes';
import recordRoutes from './record.routes';
import dashboardRoutes from './dashboard.routes';
import userRoutes from './user.routes';

const router = Router();

// Mount all route groups
router.use('/auth', authRoutes);
router.use('/records', recordRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/admin/users', userRoutes);

export default router;
