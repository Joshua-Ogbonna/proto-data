import { Router } from 'express'
import tileRoutes from './tileRoutes'
import orderRoutes from './orderRoutes'
import datasetRequestRoutes from './dataRequestRoutes'
import authRoutes from './authRoutes'
import paymentRoutes from './paymentRoutes'

const router = Router()

router.use('/tiles', tileRoutes)
router.use('/orders', orderRoutes)
router.use('/dataset-requests', datasetRequestRoutes)
router.use("/auth", authRoutes)
router.use('/payments', paymentRoutes)

export default router