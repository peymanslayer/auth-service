import { Controller } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUser } from './dtos/create.user.dto';


@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  public count = 0;

  @MessagePattern('signUp')
  async signUp( @Payload() user:CreateUser): Promise<any> {
    
    return await this.authService.signUp(user) 
  }

  @MessagePattern('logIn')
  async signIn(@Payload() user: CreateUser) {
  
    // return await circuit.excute( this.authService.signIn,user)
  }
  @MessagePattern('refreshToken')
  async refreshToken(@Payload() token: { refreshToken: string }) {
    const refreshToken = await this.authService.refreshToken(token);
    return refreshToken;
  }
}
