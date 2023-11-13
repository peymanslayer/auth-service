import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { CreateUser } from 'src/dtos/create.user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Tokens } from './tokens.service';
import { lastValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';

import {
  resultTokenMessage,
  resultMessage,
} from 'src/types/result.message.type';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private client: ClientProxy,
    private readonly token: Tokens,
  ) {}

  async signUp(user: CreateUser): Promise<resultMessage | resultTokenMessage> {
    const findUser = this.client.send('findUser', user.email);
    const result = await lastValueFrom(findUser);

    if (result !== null) {
      return {
        status: 202,
        message: 'user exist',
      };
    } else {
      return this.signUpProcess(user);
    }
  }

  async signUpProcess(user: CreateUser): Promise<resultTokenMessage> {
    const hashedPassword =await bcrypt.hash(user.password,10);
    user.password=hashedPassword;
    const data = await this.client.send('insertUser',user).toPromise();
    console.log(data);
    
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

  async signIn(user) {
    const findUser = this.client.send('findUser', user.email);
    const result = await lastValueFrom(findUser);
    if (!result) throw new ForbiddenException('Access Denied');
    else {
    }
  }

  async signInProcess(){

  }
}
