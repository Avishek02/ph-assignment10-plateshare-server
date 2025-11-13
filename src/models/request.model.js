import { Schema, model } from 'mongoose'

const requestSchema = new Schema(
  {
    food: {
      type: Schema.Types.ObjectId,
      ref: 'Food',
      required: true
    },
    donorEmail: {
      type: String,
      required: true
    },
    requesterEmail: {
      type: String,
      required: true
    },
    requesterName: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    note: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
)

const Request = model('Request', requestSchema)

export default Request
