import mongoose from 'mongoose';

export const ROLES = Object.freeze({ CUSTOMER: 'customer', ADMIN: 'admin' });

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true, // lowercase me store hota hai, isliye case-insensitive unique
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // query me by default nahi aayega
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.CUSTOMER,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.passwordHash; // response me kabhi nahi
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const User = mongoose.model('User', userSchema);