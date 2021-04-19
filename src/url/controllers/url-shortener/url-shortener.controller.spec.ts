import { Test, TestingModule } from '@nestjs/testing';
import { UrlShortenerController } from './url-shortener.controller';
import { UrlDto } from '@url-svcs/url/dto/url.dto';
import { UrlService } from '@url-svcs/url/services/url-service/url-service.service';
import { UrlRepo } from '@url-svcs/url/repositories/url-repo';
import { plainToClass } from 'class-transformer';

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

describe('UrlShortenerController', () => {
  let controller: UrlShortenerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlShortenerController],
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

    controller = module.get<UrlShortenerController>(UrlShortenerController);
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('must create a tiny url for a given long url', async () => {
    const longUrl = 'https://example.com';
    urlService.generateShortUrl.mockResolvedValueOnce({
      longUrl,
      shortUrl: '1234567',
      hash: 'hash',
    });

    const payload = {
      longUrl,
    };

    const response = await controller.createTinyUrl(
      plainToClass(UrlDto, payload),
    );

    expect(response).toBeDefined();
    expect(response.shortUrl).toBeDefined();
    expect(response.longUrl).toBeDefined();
  });

  it('must create a tiny url, using the short url provided', async () => {
    const longUrl = 'https://example.com';
    const shortUrl = 'abcdefg';

    urlRepo.saveUrl.mockResolvedValueOnce({
      longUrl,
      shortUrl: shortUrl,
      hash: 'hash',
    });

    const payload = {
      longUrl,
      shortUrl,
    };

    const response = await controller.createTinyUrl(
      plainToClass(UrlDto, payload),
    );

    expect(response).toBeDefined();
    expect(response.shortUrl).toBeDefined();
    expect(response.shortUrl).toEqual(shortUrl);
    expect(response.longUrl).toBeDefined();
  });

  it('must return same tiny url, for same long url', async () => {
    const longUrl = 'https://example.com';
    urlService.getIfExists.mockResolvedValueOnce({
      longUrl,
      shortUrl: '1234567',
      hash: 'hash',
    });

    const payload = {
      longUrl,
    };
    const response = await controller.createTinyUrl(
      plainToClass(UrlDto, payload),
    );

    expect(response).toBeDefined();
    expect(response.shortUrl).toBeDefined();
    expect(response.longUrl).toBeDefined();
  });

  it('must return same tiny url, for same long url, even if a new short url is provided', async () => {
    const longUrl = 'https://example.com';
    const shortUrl = 'abcdefg';

    urlService.getIfExists.mockResolvedValueOnce({
      longUrl,
      shortUrl: '1234567',
      hash: 'hash',
    });

    urlRepo.saveUrl.mockResolvedValueOnce({
      longUrl,
      shortUrl: shortUrl,
      hash: 'hash',
    });

    const payload = {
      longUrl,
      shortUrl,
    };
    const response = await controller.createTinyUrl(
      plainToClass(UrlDto, payload),
    );

    expect(response).toBeDefined();
    expect(response.shortUrl).toBeDefined();
    expect(response.shortUrl).toEqual('1234567');
    expect(response.longUrl).toBeDefined();
  });

  it('must throw error if given short url is already in use', async () => {
    const longUrl = 'https://example.com';
    const shortUrl = 'abcdefg';

    urlRepo.saveUrl.mockImplementationOnce(() => {
      const error = {
        code: 11000,
      };
      throw error;
    });

    let err;
    let response;
    try {
      const payload = {
        longUrl,
        shortUrl,
      };
      response = await controller.createTinyUrl(plainToClass(UrlDto, payload));
    } catch (e) {
      err = e;
    } finally {
      expect(err).toBeDefined();
      expect(err.status).toEqual(400);
      expect(response).toBeUndefined();
    }
  });
});
