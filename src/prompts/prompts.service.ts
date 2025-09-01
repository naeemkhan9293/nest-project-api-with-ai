import { Injectable } from '@nestjs/common';

@Injectable()
export class PromptsService {
  receivePrompt(): { message: string } {
    return { message: 'Prompt received successfully!' };
  }
  generateImage(): { message: string } {
    return { message: 'Image generated successfully!' };
  }
}
