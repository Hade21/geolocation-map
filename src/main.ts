import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors();
  const options = new DocumentBuilder()
    .setTitle('Geolocation API')
    .setDescription("Geolocation API for mapping unit's location")
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Local environment')
    .addServer(
      'https://geolocation-map.adaptable.app',
      'Production environment',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(parseInt(process.env.PORT));
}
bootstrap();
