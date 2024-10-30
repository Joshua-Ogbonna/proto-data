import mongoose, { Document, Schema } from 'mongoose'

export interface ICredits extends Document {
  userId: string
  amount: number
  transactionType: 'purchase' | 'usage'
  description: string
  stripeSessionId?: string
  status: 'pending' | 'completed' | 'failed'
}

const CreditsSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  transactionType: {
    type: String,
    enum: ['purchase', 'usage'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  stripeSessionId: String,
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true
})

export default mongoose.model<ICredits>('Credits', CreditsSchema)