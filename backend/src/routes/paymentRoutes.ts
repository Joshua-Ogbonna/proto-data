import { Router } from 'express'
import { 
  createCheckoutSession,
  handleWebhook,
  getTransactionHistory,
} from '../controllers/paymentController'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

// Public webhook endpoint (this should be in main routes if not already there)
router.post('/webhook', handleWebhook)

// Protected routes - require authentication
router.use(authenticate)

// Credit purchase
router.post('/create-checkout', createCheckoutSession)

// Credit balance and history
router.get('/transactions', getTransactionHistory)

// Admin routes
router.use(authorize('admin'))
router.get('/transactions/all', getTransactionHistory)

export default router