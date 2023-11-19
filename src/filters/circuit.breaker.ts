import { Catch, ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';
import { Observable, throwError } from 'rxjs'; 

@Catch(RpcException)
export class RpcExceptionToHttpExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
   if(exception instanceof RpcException){
    console.log('ok');
    
   }else{
    console.log('mo');
    
   }
  }
}