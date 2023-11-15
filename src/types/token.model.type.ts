import mongoose from "mongoose"

export type TokenModel={
    id:mongoose.Types.ObjectId,
    refreshToken:string,
    user:mongoose.Types.ObjectId
}