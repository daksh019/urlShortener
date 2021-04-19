import { Test, TestingModule } from '@nestjs/testing';
import { UrlServiceService } from './url-service.service';

describe('UrlServiceService', () => {
  let service: UrlServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlServiceService],
    }).compile();

    service = module.get<UrlServiceService>(UrlServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
