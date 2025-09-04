import { ApiProperty } from '@nestjs/swagger';

export class PromptDto {
  @ApiProperty({
    description: 'Prompt to get something from url',
    example: 'A cat with a hat',
  })
  prompt: string;
}
