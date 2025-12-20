import { Router } from 'express'
import Food from '../models/Food.js'
import { asyncHandler } from '../utils/errors.js'
import { requireAuth } from '../middleware/auth.js'

const r = Router()

r.get(
  '/',
  asyncHandler(async (req, res) => {
    const { status, email } = req.query
    const filter = {}
    if (status) filter.status = status
    if (email) filter['donor.email'] = email
    const foods = await Food.find(filter).sort({ createdAt: -1 })
    res.json(foods)
  })
)

r.get(
  '/featured',
  asyncHandler(async (req, res) => {
    const foods = await Food.find({ status: 'Available' })
    const top = foods
      .map(f => ({ f, score: parseInt((f.quantity.match(/\d+/) || ['0'])[0], 10) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(x => x.f)
    res.json(top)
  })
)

r.get(
  '/my',
  requireAuth,
  asyncHandler(async (req, res) => {
    const email = req.user?.email
    if (!email) return res.status(401).json({ message: 'Unauthorized' })
    const foods = await Food.find({ 'donor.email': email }).sort({ createdAt: -1 })
    res.json(foods)
  })
)

r.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const food = await Food.findById(req.params.id)
    if (!food) return res.status(404).json({ message: 'Not found' })
    res.json(food)
  })
)

r.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { name, imageUrl, quantity, pickupLocation, expireDate, notes } = req.body
    const food = await Food.create({
      name,
      imageUrl,
      quantity,
      pickupLocation,
      expireDate,
      notes,
      donor: {
        name: req.user.name || req.user.email,
        email: req.user.email,
        photoURL: req.user.picture,
        uid: req.user.uid
      },
      status: 'Available'
    })
    res.status(201).json(food)
  })
)

r.patch(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const food = await Food.findById(req.params.id)
    if (!food) return res.status(404).json({ message: 'Not found' })
    if (food.donor.email !== req.user.email) return res.status(403).json({ message: 'Forbidden' })

    const allowed = ['name', 'imageUrl', 'quantity', 'pickupLocation', 'expireDate', 'notes', 'status']
    for (const k of allowed) if (k in req.body) food[k] = req.body[k]

    await food.save()
    res.json(food)
  })
)

r.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const food = await Food.findById(req.params.id)
    if (!food) return res.status(404).json({ message: 'Not found' })
    if (food.donor.email !== req.user.email) return res.status(403).json({ message: 'Forbidden' })

    await food.deleteOne()
    res.json({ ok: true })
  })
)

export default r
