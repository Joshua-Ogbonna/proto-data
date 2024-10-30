import { Request, Response, NextFunction } from 'express'
import Order from '../models/Order'
import { createPaymentSession, handlePaymentWebhook } from '../services/paymentService'
import { ApiError } from '../utils/ApiError'

export const createCheckoutSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { items } = req.body
      const userId = req.user.userId
  
      const session = await createPaymentSession(items, userId, 'order')
      res.json(session)
    } catch (error) {
      next(error)
    }
  }

export const handleStripeWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers['stripe-signature'] as string
    await handlePaymentWebhook(signature, req.body)
    res.json({ received: true })
  } catch (error) {
    next(error)
  }
}

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.userId
    const isAdmin = req.user.role === 'admin'
    
    const query = isAdmin ? {} : { userId }
    const orders = await Order.find(query).sort({ createdAt: -1 })
    
    res.json(orders)
  } catch (error) {
    next(error)
  }
}

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params
    const userId = req.user.userId
    const isAdmin = req.user.role === 'admin'

    const order = await Order.findById(orderId)
    if (!order) {
      throw new ApiError(404, 'Order not found')
    }

    // Check if user has permission to view this order
    if (!isAdmin && order.userId !== userId) {
      throw new ApiError(403, 'Not authorized to view this order')
    }

    res.json(order)
  } catch (error) {
    next(error)
  }
}

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params
    const { status } = req.body

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    )

    if (!order) {
      throw new ApiError(404, 'Order not found')
    }

    res.json(order)
  } catch (error) {
    next(error)
  }
}