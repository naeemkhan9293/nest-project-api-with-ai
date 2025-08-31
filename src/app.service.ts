import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  receivePrompt(): any {
    return { message: 'Your prompt successfully received' };
  }
}
