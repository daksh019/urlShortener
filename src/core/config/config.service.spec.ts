import { Test, TestingModule } from '@nestjs/testing';
import { cloneDeep } from 'lodash';
import { AppConfigService } from './config.service';

describe('ConfigService', () => {
  let service: AppConfigService;
  let processEnv;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppConfigService],
    }).compile();

    processEnv = cloneDeep(process.env);

    service = module.get<AppConfigService>(AppConfigService);
  });

  afterAll(() => {
    process.env = processEnv;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return baseUrl configuration from process.env', () => {
    process.env.BASE_URL = 'localhost';
    expect(service.baseUrl).toEqual('localhost/');
  });
});
