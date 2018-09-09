import { NestMiddleware, MiddlewareFunction, Injectable } from '@nestjs/common';

const path = require('path');
const ROUTE_PREFIX = 'api';
const allowedExt = [
  '.js',
  '.ico',
  '.css',
  '.png',
  '.jpg',
  '.woff2',
  '.woff',
  '.ttf',
  '.otf',
  '.svg',
];

const resolvePath = (file: string) =>
  path.resolve(__dirname, `../../public/${file}`);

@Injectable()
export class FrontendMiddleware implements NestMiddleware {
  resolve(..._: any[]): MiddlewareFunction {
    return (req, res, next) => {
      const { baseUrl } = req;
      if (baseUrl.indexOf(ROUTE_PREFIX) === 1) {
        // it starts with /api --> continue with execution
        next();
      } else if (
        allowedExt.filter(ext => baseUrl.indexOf(ext) > 0).length > 0
      ) {
        // it has a file extension --> resolve the file
        res.sendFile(resolvePath(baseUrl.replace(/^(\/app)/, '')));
      } else {
        // in all other cases, redirect to the index.html!
        res.sendFile(resolvePath('index.html'));
      }
    };
  }
}
