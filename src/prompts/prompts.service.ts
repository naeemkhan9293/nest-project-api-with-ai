import { Injectable } from '@nestjs/common';

@Injectable()
export class PromptsService {
  receivePrompt(): { message: string } {
    return { message: 'Prompt received successfully!' };
  }
}
