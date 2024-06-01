import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
}, { timestamps: true, versionKey: false });

export default mongoose.models.User || mongoose.model("User", userSchema, 'users');
