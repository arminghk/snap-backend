// export default () => ({
//   port: parseInt(process.env.PORT ?? '3000', 10) || 3000
// });


import {registerAs} from "@nestjs/config";

const AppConfig = registerAs('App', () => ({
  version:'v1',
  port: 3000,
}));

const SwaggerConfig = registerAs('Swagger', () => ({
  title:'snap-backend',
  description:'this is online trasporter application',
  version:'1.0.0'
}));

export const configurations = [AppConfig , SwaggerConfig];