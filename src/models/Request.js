import mongoose from 'mongoose';
const RequestSchema = new mongoose.Schema({
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true, index: true },
  requester: { name: String, email: { type: String, required: true }, photoURL: String, uid: String },
  location: { type: String, required: true },
  reason: { type: String, required: true },
  contactNo: { type: String, required: true },
  status: { type: String, enum: ['pending','accepted','rejected'], default: 'pending' }
}, { timestamps: true });
export default mongoose.model('Request', RequestSchema);
