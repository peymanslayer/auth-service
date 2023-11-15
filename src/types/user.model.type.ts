import mongoose from "mongoose"

export type UserModelType={
    id:mongoose.Types.ObjectId,
    password:string,
    email:string,
    number:number,
    name:string

}