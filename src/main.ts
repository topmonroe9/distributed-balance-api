import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    const app = await NestFactory.create(AppModule);

    app.enableCors();

    const port = process.env.API_PORT || 3000;
    await app.listen(port, '0.0.0.0'); // Listen on all network interfaces

    logger.log(`Application is running on port ${port}`);
  } catch (error) {
    logger.error(`Failed to start application: ${error.message}`, error.stack);
    process.exit(1);
  }
}

bootstrap();
