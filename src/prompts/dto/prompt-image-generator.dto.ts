import { ApiProperty } from '@nestjs/swagger';

export class PromptImageGeneratorDto {
  @ApiProperty()
  prompt: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}
