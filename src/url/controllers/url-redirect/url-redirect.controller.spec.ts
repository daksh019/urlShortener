import { Test, TestingModule } from '@nestjs/testing';
import { UrlRedirectController } from './url-redirect.controller';

describe('UrlRedirectController', () => {
  let controller: UrlRedirectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlRedirectController],
    }).compile();

    controller = module.get<UrlRedirectController>(UrlRedirectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
