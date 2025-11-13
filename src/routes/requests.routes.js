import { Router } from 'express';
import Food from '../models/Food.js';
import Request from '../models/Request.js';
import { asyncHandler } from '../utils/errors.js';
import { requireAuth } from '../middleware/auth.js';
const r = Router();

r.post('/', requireAuth, asyncHandler(async (req, res) => {
  const { foodId, location, reason, contactNo } = req.body;
  const food = await Food.findById(foodId);
  if (!food) return res.status(404).json({ message: 'Food not found' });
  const request = await Request.create({
    foodId, location, reason, contactNo,
    requester: { name: req.user.name || req.user.email, email: req.user.email, photoURL: req.user.picture, uid: req.user.uid },
    status: 'pending'
  });
  res.status(201).json(request);
}));

r.get('/food/:id', requireAuth, asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) return res.status(404).json({ message: 'Food not found' });
  if (food.donor.email !== req.user.email) return res.status(403).json({ message: 'Forbidden' });
  const requests = await Request.find({ foodId: food._id }).sort({ createdAt: -1 });
  res.json(requests);
}));

r.patch('/:id', requireAuth, asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);
  if (!request) return res.status(404).json({ message: 'Not found' });
  const food = await Food.findById(request.foodId);
  if (!food) return res.status(404).json({ message: 'Food not found' });
  if (food.donor.email !== req.user.email) return res.status(403).json({ message: 'Forbidden' });
  const { status } = req.body; // accepted | rejected
  if (!['accepted','rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
  request.status = status; await request.save();
  if (status === 'accepted') { food.status = 'Donated'; await food.save(); }
  res.json(request);
}));

export default r;
