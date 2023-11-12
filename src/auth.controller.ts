import { Controller, Get,Res } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { MessagePattern,Payload } from '@nestjs/microservices';
import { CreateUser } from './dtos/create.user.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('signUp')
  async signUp(@Payload() user:CreateUser){
   const result=await this.authService.signUp(user);
   return result;
}

}
