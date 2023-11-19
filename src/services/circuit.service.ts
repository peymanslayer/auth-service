import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { isString } from 'class-validator';
import { CreateUser } from 'src/dtos/create.user.dto';

const MAX_FAILURE = 2;
const SUCCSES_TIME = 2;
const TO_HALF_OPEN = 60000;

enum State {
  closed,
  open,
  halfOpen,
}
@Injectable()
export class circuitBreakerService {
  public failure: number = 0;
  public succesTime: number = 0;
  public nextAttemp: number;
  public state: State = State.closed;
  constructor(@Inject('USER_SERVICE') private client: ClientProxy) {}

  async circuitBreaker(pattern: string, Param: CreateUser) {
    try {
      if (this.failure >= 2) {
        return {
          status: 408,
          message: 'err ',
        };
      } else {
        return await this.client.send(pattern, Param).toPromise();
      }
    } catch (err) {
      this.succesTime--;
      this.failure++;
      return this.handleError(err);
    }
  }

  handleError(err: Error) {
    this.state = State.open;
    return {
      status: 400,
      message: `err is ${err.message}`,
    };
  }

  circuitMessage(data: any) {
    if (isString(data.message)) {
      return {
        status: 404,
        message: data.message,
      };
    }
  }
}
