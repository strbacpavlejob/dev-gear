import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpExceptionErrorFilter } from './common/error/filters/httpExceptionError.filter';

export const setupApp: (app: INestApplication) => void = (
  app: INestApplication,
) => {
  //app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new HttpExceptionErrorFilter());
  // Starts listening for shutdown hooks - Terminus(health check) integration makes use of this lifecycle event
  app.enableShutdownHooks();
};
