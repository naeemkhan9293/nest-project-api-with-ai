import { Controller, Post, UseGuards } from '@nestjs/common';
import { PromptsService } from './prompts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

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
  @ApiOperation({ summary: 'Generate an image (Protected Route)' })
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
  generateImage(): { message: string } {
    return this.promptsService.generateImage();
  }
}
