import { Injectable } from '@nestjs/common';
import { ConfigService as NestJSConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService extends NestJSConfigService {
  get baseUrl(): string {
    return this.get('BASE_URL') + '/';
  }
}
