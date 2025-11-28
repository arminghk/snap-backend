import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AdminModule } from 'src/rest/admin/admin.module';
import { DriverModule } from 'src/rest/driver/driver.module';
import { PassengerModule } from 'src/rest/passenger/passenger.module';

interface SwaggerModuleItem {
  path: string;
  module?: any;
}

export function setupSwagger(app: INestApplication, cfg) {

  const apiVersion = cfg.get('server.apiVersion');
  const swaggerTitle = cfg.get('server.swagger.title');
  const swaggerDescription = cfg.get('server.swagger.description');
  const swaggerVersion = cfg.get('server.swagger.version');

  const swaggerOptions = new DocumentBuilder()
    .setTitle(swaggerTitle)
    .setDescription(swaggerDescription)
    .setVersion(swaggerVersion)
    .build();

  const mainDocument = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(`${apiVersion}/docs`, app, mainDocument);

  const modules: SwaggerModuleItem[] = [
    { path: 'admin', module: AdminModule },
    { path: 'driver', module: DriverModule },
    { path: 'passenger', module: PassengerModule },
  ];

  modules.forEach(({ path, module }) => {
    const doc = SwaggerModule.createDocument(app, swaggerOptions, { include: [module] });
    SwaggerModule.setup(`${apiVersion}/docs/${path}`, app, doc);
  });
}
