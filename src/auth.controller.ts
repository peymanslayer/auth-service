import { Controller } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUser } from './dtos/create.user.dto';
import { resultMessage, resultTokenMessage } from './types/result.message.type';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('signUp')
  async signUp(
    @Payload() user: CreateUser,
  ): Promise<resultMessage | resultTokenMessage> {
    const result = await this.authService.signUp(user);
    return result;
  }
}
