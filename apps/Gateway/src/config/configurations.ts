// export default () => ({
//   port: parseInt(process.env.PORT ?? '3000', 10) || 3000
// });


import {registerAs} from "@nestjs/config";

const AppConfig = registerAs('App', () => ({
  port: 3000,
}));

export const configurations = [AppConfig];