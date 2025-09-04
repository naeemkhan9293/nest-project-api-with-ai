import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
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
import { PromptDto } from './dto/prompt.dto';

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
  @ApiBody({ type: PromptDto })
  async receivePrompt(
    @Body() body: { prompt: string },
  ): Promise<{ message: string }> {
    const { prompt } = body;
    return await this.promptsService.receivePrompt(prompt);
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
    description:
      'Image generated successfully and returned as a file, or a text message if no image was generated.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
      'image/png': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
      'image/jpeg': {
        schema: {
          type: 'string',
          format: 'binary',
        },
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
    @Res() res: Response,
  ): Promise<void> {
    const { prompt } = body;
    const result = await this.promptsService.generateImage(prompt, image);

    if (result.image && result.mimeType) {
      res.setHeader('Content-Type', result.mimeType);
      res.send(result.image);
    } else {
      res.json({ message: result.message });
    }
  }
}
