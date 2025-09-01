import { NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { darkModeCss } from './swagger-dark-mode';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('AI CHATBOT')
    .setDescription('This chatbot will generate images and many more')
    .setVersion('1.0')
    .addTag('chatbot')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Define custom options, including the CSS
  const swaggerCustomOptions: SwaggerCustomOptions = {
    customCss: darkModeCss,
  };

  SwaggerModule.setup('api', app, document, swaggerCustomOptions);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
