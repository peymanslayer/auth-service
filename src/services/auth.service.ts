import { Injectable, Inject } from '@nestjs/common';
import { CreateUser } from 'src/dtos/create.user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Tokens } from './tokens.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private client: ClientProxy,
    private readonly token: Tokens,
  ) {}

  async signUp(user: CreateUser) {
    const findUser = await this.client.emit('findUser', user.email).subscribe();
    console.log(findUser);
    if (findUser) {
      return {
        status: 202,
        message: 'user exist',
      };
    } else {
      return this.signUpProcess(user);
    }
  }


  async signUpProcess(user: CreateUser) {
    await this.client.emit('insertUser', user).toPromise();
    const Tokens = await this.token.getTokens(user.email);
    const { acssesToken, refreshToken } = Tokens;
    return {
      status: 201,
      message: {
        acssesToken,
        refreshToken,
      },
    };
  }
}
