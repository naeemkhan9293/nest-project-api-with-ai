import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PromptsModule } from './prompts/prompts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ep-little-bonus-aepsm0qz-pooler.c-2.us-east-2.aws.neon.tech', 
      port: 5432, 
      username: 'neondb_owner', 
      password: 'npg_frGWAY7DtzS4', 
      database: 'neondb', 
      entities: [User],
      synchronize: true,
      ssl: true,
    }),
    PromptsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
