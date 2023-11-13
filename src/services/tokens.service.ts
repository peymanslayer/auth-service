import { JwtService } from '@nestjs/jwt';

export class Tokens {
  public jwtService: JwtService = new JwtService();
  
  async getTokens(
    email: string,
  ): Promise<{ acssesToken: string; refreshToken: string }> {
    const Payload={
      email,
    }
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
}
