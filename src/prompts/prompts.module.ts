import { Module } from '@nestjs/common';
import { PromptsController, GenerateImageController } from './prompts.controller';
import { PromptsService } from './prompts.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PromptsController, GenerateImageController],
  providers: [PromptsService],
})
export class PromptsModule {}
