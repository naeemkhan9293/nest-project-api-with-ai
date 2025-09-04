import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { PromptsService } from './prompts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { PromptImageGeneratorDto } from './dto/prompt-image-generator.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Prompts')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('prompts')
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Post()
  @ApiOperation({ summary: 'Send a prompt (Protected Route)' })
  @ApiResponse({
    status: 200,
    description: 'Prompt received successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required',
  })
  receivePrompt(): { message: string } {
    return this.promptsService.receivePrompt();
  }
}

@ApiTags('Prompts')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('generate-image')
export class GenerateImageController {
  constructor(private readonly promptsService: PromptsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Generate an image (Protected Route)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Image generated successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required',
  })
  @ApiBody({ type: PromptImageGeneratorDto })
  async generateImage(
    @Body() body: { prompt: string },
    @UploadedFile() image: Express.Multer.File,
  ): Promise<{ message: string }> {
    console.log(image);
    console.log(body.prompt);
    return await this.promptsService.generateImage();
  }
}
