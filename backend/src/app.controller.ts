import { Get, Controller, Res } from '@nestjs/common';
import { AppService } from './app.service';
export const ROUTE_PREFIX = 'test';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root(@Res() response): void {
    // the homepage will load our index.html which contains React logic
    response.sendFile('index.html');
  }

  @Get(ROUTE_PREFIX)
  serverApi(): string {
    // Some api data, can be an object also
    return this.appService.root();
  }
}
