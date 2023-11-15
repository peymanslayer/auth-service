import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { model } from 'mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Token {

  @Prop({ref:'user'})
  user:mongoose.Schema.Types.ObjectId

  @Prop({ required: true })
  refreshToken: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
export type TokenDocument =HydratedDocument<Token>;
