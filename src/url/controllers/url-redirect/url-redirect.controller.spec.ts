import { Test, TestingModule } from '@nestjs/testing';
import { UrlRedirectController } from './url-redirect.controller';
import { UrlService } from '@url-svcs/url/services/url-service/url-service.service';
import { UrlRepo } from '@url-svcs/url/repositories/url-repo';

const urlService = {
  generateShortUrl: jest.fn(),
  getIfExists: jest.fn(),
  isValidShortUrl: jest.fn(),
  getHash: jest.fn(),
};

const urlRepo = {
  saveUrl: jest.fn().mockResolvedValue({
    shortUrl: '1234567',
    hash: 'hash',
  }),
};

describe('UrlRedirectController', () => {
  let controller: UrlRedirectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlRedirectController],
      providers: [
        {
          provide: UrlService,
          useValue: urlService,
        },
        {
          provide: UrlRepo,
          useValue: urlRepo,
        },
      ],
    }).compile();

    controller = module.get<UrlRedirectController>(UrlRedirectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
