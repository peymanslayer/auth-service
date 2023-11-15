import mongoose from "mongoose";

export type resultTokenMessage = {
  status: number;
  message: {
    id: mongoose.Types.ObjectId;
    refreshToken: string;
  };
};

export type resultMessage = {
  status: number;
  message: string;
};
