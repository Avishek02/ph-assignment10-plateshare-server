import mongoose from 'mongoose';
const FoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  quantity: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  expireDate: { type: Date, required: true },
  notes: String,
  status: { type: String, enum: ['Available', 'Donated'], default: 'Available' },
  donor: { name: String, email: { type: String, required: true, index: true }, photoURL: String, uid: String }
}, { timestamps: true });
export default mongoose.model('Food', FoodSchema);
