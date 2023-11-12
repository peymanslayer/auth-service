import { IsNotEmpty,IsString, IsNumber,IsEmail } from "class-validator";

export class CreateUser {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email:string;

  @IsNotEmpty()
  @IsString()
  password:string;
  
  @IsNumber()
  number:number;

  @IsNotEmpty()
  @IsString()
  name:string

}