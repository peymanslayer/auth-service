import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AcssesTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: '1234'
      });
    }
  
    validate(email:string) {
      return email;
    }
  }