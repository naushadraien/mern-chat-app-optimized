import { Schema, model, models } from 'mongoose';
import { hash } from 'bcryptjs';
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
    },
    bio: {
        type: String,
        required: [true, 'Please provide biography'],
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        unique: [true, 'This email is already registered'],
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Please provide a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: [8, 'Password should be at least 8 characters'],
        select: false,
        //   maxlength: [20, "Password should not exceed 20 characters"],
    },
    avatar: {
        public_id: {
            type: String,
            required: [true, 'Please provide public_id'],
        },
        url: {
            type: String,
            required: [true, 'Please provide url'],
        },
    },
}, { timestamps: true });
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    this.password = await hash(this.password, 10);
});
export const User = models.User || model('User', userSchema);
