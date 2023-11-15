import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { ClientsModule } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';
import { Tokens } from './services/tokens.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenSchema } from './schema/token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'token', schema: TokenSchema }]),
    MongooseModule.forRoot('mongodb://localhost:27017/token'),
    PassportModule,
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'user_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService,Tokens],
})
export class AuthModule {}
