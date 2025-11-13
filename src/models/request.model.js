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
    requesterPhoto: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    contactNo: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending'
    }
  },
  { timestamps: true }
)

const Request = model('Request', requestSchema)

export default Request
