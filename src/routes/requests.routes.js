import { Router } from 'express'
import Request from '../models/request.model.js'
import Food from '../models/food.model.js'
import { auth } from '../middleware/auth.js'

const router = Router()

router.post('/', auth, async (req, res, next) => {
  try {
    const { foodId, note } = req.body
    const user = req.user

    if (!foodId) {
      return res.status(400).json({ message: 'foodId is required' })
    }

    const food = await Food.findById(foodId)
    if (!food) {
      return res.status(404).json({ message: 'Food not found' })
    }

    if (food.donorEmail === user.email) {
      return res.status(400).json({ message: 'Cannot request own food' })
    }

    const existing = await Request.findOne({
      food: foodId,
      requesterEmail: user.email
    })

    if (existing) {
      return res.status(400).json({ message: 'Already requested this food' })
    }

    const request = await Request.create({
      food: foodId,
      donorEmail: food.donorEmail,
      requesterEmail: user.email,
      requesterName: user.name || user.email,
      note: note || ''
    })

    res.status(201).json(request)
  } catch (err) {
    next(err)
  }
})

router.get('/my', auth, async (req, res, next) => {
  try {
    const email = req.user.email
    const requests = await Request.find({ requesterEmail: email }).populate('food')
    res.json(requests)
  } catch (err) {
    next(err)
  }
})

router.get('/donor', auth, async (req, res, next) => {
  try {
    const email = req.user.email
    const requests = await Request.find({ donorEmail: email }).populate('food')
    res.json(requests)
  } catch (err) {
    next(err)
  }
})

router.patch('/:id/status', auth, async (req, res, next) => {
  try {
    const { status } = req.body
    const email = req.user.email

    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
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

    res.json(request)
  } catch (err) {
    next(err)
  }
})

export default router
