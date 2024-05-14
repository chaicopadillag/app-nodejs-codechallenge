import { appConfig } from '@/config';
import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('ApiGateway');

  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);

  app.enableCors({
    origin: config.allowedOrigins,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  await app.listen(config.port, () => {
    logger.log(
      `Api Gateway running on: http://localhost:${config.port}/graphql 🚀`,
    );
  });
}
bootstrap();
