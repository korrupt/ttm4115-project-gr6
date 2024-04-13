import { registerAs } from "@nestjs/config";

export default registerAs('typeorm', () => ({
  HOST: process.env['TYPEORM_HOST'],
  PORT: parseInt(process.env['TYPEORM_PORT']!),
  USER: process.env['TYPEORM_USER'],
  PASSWORD: process.env['TYPEORM_PASSWORD'],
  DATABASE: process.env['TYPEORM_DATABASE'],
}));
