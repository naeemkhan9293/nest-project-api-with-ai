import { Controller, Post } from '@nestjs/common';
import { PromptsService } from './prompts.service';

@Controller('prompts')
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Post()
  receivePrompt(): { message: string } {
    return this.promptsService.receivePrompt();
  }
}
