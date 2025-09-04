import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'john_doe', description: 'Username for the user' })
  username: string;

  @ApiProperty({ example: 'password123', description: 'Password for the user' })
  password: string;
}
