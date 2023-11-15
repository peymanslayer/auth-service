import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { CreateUser } from 'src/dtos/create.user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Tokens } from './tokens.service';
import { Token, TokenDocument } from 'src/schema/token.schema';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';
import {
  resultTokenMessage,
  resultMessage,
} from 'src/types/result.message.type';
import { InjectModel } from '@nestjs/mongoose';
import { UserModelType } from 'src/types/user.model.type';

@Injectable()
export class AuthService extends Tokens {
  constructor(
    @Inject('USER_SERVICE') private client: ClientProxy,
    private readonly token: Tokens,
    @InjectModel('token') public readonly model: Model<Token>,
  ) {
    super(model);
  }

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
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    const data = await this.client.send('insertUser', user).toPromise();
    console.log(data);

    const { id } = data;
    const Tokens = await this.token.getTokens(user.email);
    const { refreshToken } = Tokens;
    await this.model.create({
      user: data.id,
      refreshToken: refreshToken,
    });
    return {
      status: 201,
      message: { refreshToken, id },
    };
  }


  async signIn(user: CreateUser) {
    const findUser = this.client.send('findUser', user.email);
    const message = await lastValueFrom(findUser);
    if (!message) throw new ForbiddenException('Access Denied');
    else {
      const result = await this.signInProcess(user, message);
      return result;
    }
  }

  async signInProcess(user: CreateUser, result: UserModelType) {
    const passIsEqual = await bcrypt.compare(user.password, result.password);
    if (passIsEqual) {
      const tokens = await this.token.getTokens(user.email);
      const findToken = await this.model.findOne({
        user: result.id,
      });
      const saveToken = await this.token.saveToken(tokens, findToken);
      return {
        status: saveToken.status,
        message: saveToken.message,
      };
    } else {
      return {
        status: 400,
        message: 'password not match',
      };
    }
  }

}
