import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    name: string;
    timezone: string;
}

const userSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
})

export const User = mongoose.model<IUser>("User", userSchema);