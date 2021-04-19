import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url-service.service';
import { UrlRepo } from '@url-svcs/url/repositories/url-repo';

const urlRepo = {
  saveUrl: jest.fn().mockResolvedValue({
    shortUrl: '1234567',
    hash: 'hash',
  }),
};

describe('UrlService', () => {
  let service: UrlService;

  urlRepo.saveUrl.mockReset();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UrlRepo,
          useValue: urlRepo,
        },
        UrlService,
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateShortUrl generation', () => {
    it('must generate short url for a given long url', async () => {
      const longUrl = 'https://google.com';
      urlRepo.saveUrl.mockResolvedValueOnce({
        longUrl: longUrl,
        shortUrl: '1234567',
        hash: 'hash',
      });

      let savedUrl;
      let err;

      try {
        savedUrl = await service.generateShortUrl(longUrl, 'hash', 0);
      } catch (e) {
        err = e;
      } finally {
        expect(err).toBeFalsy();
        expect(savedUrl).toBeDefined();
        expect(savedUrl.shortUrl).toBeDefined();
        expect(savedUrl.shortUrl).toBe('1234567');
      }
    });

    it('must generate re-attempt in case of a clashing url', async () => {
      const longUrl = 'https://google.com';
      urlRepo.saveUrl
        .mockImplementationOnce(() => {
          const error = {
            code: 11000,
          };
          throw error;
        })
        .mockImplementationOnce(() => ({
          longUrl: longUrl,
          shortUrl: 'abcdefg',
          hash: 'hash',
        }));
      jest.spyOn(service, 'generateShortUrl');

      let savedUrl;
      let err;

      try {
        savedUrl = await service.generateShortUrl(longUrl, 'hash', 0);
      } catch (e) {
        err = e;
      } finally {
        expect(err).toBeFalsy();
        expect(savedUrl).toBeDefined();
        expect(savedUrl.shortUrl).toBeDefined();
        expect(savedUrl.shortUrl).toBe('abcdefg');
        expect(service.generateShortUrl).toBeCalledTimes(2);
      }
    });

    it('must generate re-attempt for three times after first failure', async () => {
      const longUrl = 'https://google.com';

      urlRepo.saveUrl.mockImplementation(() => {
        const error = {
          code: 11000,
        };
        throw error;
      });

      jest.spyOn(service, 'generateShortUrl');

      let savedUrl;
      let err;

      try {
        savedUrl = await service.generateShortUrl(longUrl, 'hash', 0);
      } catch (e) {
        err = e;
      } finally {
        expect(err).toBeDefined();
        expect(savedUrl).toBeUndefined();
        expect(service.generateShortUrl).toBeCalledTimes(4);
      }
    });
  });
});
