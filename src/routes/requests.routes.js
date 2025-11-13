import { Router } from 'express'
import Request from '../models/request.model.js'
import Food from '../models/Food.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/errors.js'

const r = Router()

r.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { foodId, location, reason, contactNo } = req.body
    const user = req.user

    if (!foodId || !location || !reason || !contactNo) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const food = await Food.findById(foodId)
    if (!food) {
      return res.status(404).json({ message: 'Food not found' })
    }

    if (food.donor.email === user.email) {
      return res.status(400).json({ message: 'Cannot request own food' })
    }

    const existing = await Request.findOne({
      food: foodId,
      requesterEmail: user.email
    })

    if (existing) {
      return res.status(400).json({ message: 'You already requested this food' })
    }

    const request = await Request.create({
      food: foodId,
      donorEmail: food.donor.email,
      requesterEmail: user.email,
      requesterName: user.name || user.email,
      requesterPhoto: user.picture || '',
      location,
      reason,
      contactNo
    })

    res.status(201).json(request)
  })
)

r.get(
  '/my',
  requireAuth,
  asyncHandler(async (req, res) => {
    const email = req.user.email
    const requests = await Request.find({ requesterEmail: email }).populate('food')
    res.json(requests)
  })
)

r.get(
  '/donor',
  requireAuth,
  asyncHandler(async (req, res) => {
    const email = req.user.email
    const requests = await Request.find({ donorEmail: email }).populate('food')
    res.json(requests)
  })
)

r.get(
  '/food/:foodId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const email = req.user.email
    const { foodId } = req.params

    const food = await Food.findById(foodId)
    if (!food) {
      return res.status(404).json({ message: 'Food not found' })
    }

    if (food.donor.email !== email) {
      return res.status(403).json({ message: 'Not allowed' })
    }

    const requests = await Request.find({ food: foodId }).sort({ createdAt: -1 })
    res.json(requests)
  })
)

r.patch(
  '/:id/status',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { status } = req.body
    const email = req.user.email

    if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const request = await Request.findById(req.params.id).populate('food')
    if (!request) {
      return res.status(404).json({ message: 'Request not found' })
    }

    if (request.donorEmail !== email) {
      return res.status(403).json({ message: 'Not allowed' })
    }

    request.status = status
    await request.save()

    if (status === 'Accepted' && request.food) {
      request.food.status = 'Donated'
      await request.food.save()
    }

    res.json(request)
  })
)

export default r
