import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { cloneDeep } from 'lodash';
import { UrlDto } from './url.dto';

describe('Transaction - UrlDto', () => {
  const sampleDto = {
    longUrl: 'https://google.com',
    shortUrl: '1234567',
  };

  it('should pass all validations both long url and short url are present', async () => {
    const testdata = cloneDeep(sampleDto);
    const dtoInstance = plainToClass(UrlDto, testdata);

    const [error] = await validate(dtoInstance);
    expect(error).toBeFalsy();
  });

  it('should fail validations if long url is incorrect', async () => {
    const testdata = cloneDeep(sampleDto);
    testdata.longUrl = 'random string';
    const dtoInstance = plainToClass(UrlDto, testdata);

    const [error] = await validate(dtoInstance);
    expect(error).toBeDefined();
    expect(error.property).toEqual('longUrl');
  });

  it('should fail validations if short url is less than 7 characters long', async () => {
    const testdata = cloneDeep(sampleDto);
    testdata.shortUrl = 'abcd';
    const dtoInstance = plainToClass(UrlDto, testdata);

    const [error] = await validate(dtoInstance);
    expect(error).toBeDefined();
    expect(error.property).toEqual('shortUrl');
  });

  it('should fail validations if short url is more than 7 characters long', async () => {
    const testdata = cloneDeep(sampleDto);
    testdata.shortUrl = 'abcd1234567';
    const dtoInstance = plainToClass(UrlDto, testdata);

    const [error] = await validate(dtoInstance);
    expect(error).toBeDefined();
    expect(error.property).toEqual('shortUrl');
  });

  it('should fail validations if short url is not a string', async () => {
    const testdata = cloneDeep(sampleDto);
    testdata.shortUrl = 1234567;
    const dtoInstance = plainToClass(UrlDto, testdata);

    const [error] = await validate(dtoInstance);
    expect(error).toBeDefined();
    expect(error.property).toEqual('shortUrl');
  });

  it('should fail validations if hash is provided', async () => {
    const testdata = cloneDeep(sampleDto);
    testdata.hash = '1234567';
    const dtoInstance = plainToClass(UrlDto, testdata);

    const [error] = await validate(dtoInstance);
    expect(error).toBeFalsy();
  });
});
