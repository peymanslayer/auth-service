import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { Token, TokenDocument } from 'src/schema/token.schema';
import { InjectModel } from '@nestjs/mongoose';

export class Tokens {
  public jwtService: JwtService = new JwtService();
  constructor(@InjectModel('token') public readonly model: Model<Token>) {}

  async getTokens(
    email: string,
  ): Promise<{ acssesToken: string; refreshToken: string }> {
    const Payload = {
      email,
    };
    const acssesToken = this.jwtService.sign(Payload, {
      secret: '1234',
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(Payload, {
      secret: '1234',
      expiresIn: '7d',
    });

    return {
      acssesToken,
      refreshToken,
    };
  }

  
  async saveToken(
    token: { refreshToken: string; acssesToken: string },
    findToken: TokenDocument,
  ) {
    if (findToken) {
      token.refreshToken = findToken.refreshToken;
      return {
        status: 200,
        message: token,
      };
    } else {
      const createToken = await this.model.create({
        user: findToken.id,
      });
      return {
        status: 200,
        message: createToken,
      };
    }
  }
}
