import { Injectable } from '@nestjs/common';
import { UrlRepo } from '@url-svcs/url/repositories/url-repo';
import { UrlDocument } from '@url-svcs/url/repositories/url-schema';
import md5 from 'md5';

@Injectable()
export class UrlService {
  constructor(private urlRepo: UrlRepo) {}
  /**
   * The charset represents the possible characters which will be present in the
   * tiny url.
   */
  private readonly charset =
    '01234567879abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  private readonly charsetRegex = /^[a-zA-Z0-9]*$/;

  private readonly shortUrlLen = 7;

  private readonly urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

  /**
   * Utility function to get a character randomly picked from the charset.
   */
  private getRandomCharFromCharset() {
    const min = 0;
    const max = this.charset.length;
    const randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;
    return this.charset.charAt(randomIndex);
  }

  /**
   * Utility function to generate a random string of lenght len.
   * The string contains characters randomly picked from the charset.
   */
  public getShortUrl(): string {
    let randomStr = '';
    while (randomStr.length < this.shortUrlLen) {
      randomStr += this.getRandomCharFromCharset();
    }
    return randomStr;
  }

  public getHash(longUrl: string): string {
    return md5(longUrl, {
      asString: true,
    });
  }

  public isValidShortUrl(shortUrl: string): boolean {
    return (
      Object.prototype.toString.call(shortUrl) === '[object String]' &&
      shortUrl.length === 7 &&
      this.charsetRegex.test(shortUrl)
    );
  }

  public isValidLongUrl(url: string): boolean {
    return this.urlRegex.test(url);
  }

  public async getIfExists(hash: string): Promise<UrlDocument | null> {
    // This is one way to get around the tracking of accessing a short url.
    // Depending on what do we want to track, we can change this search to
    // be tracked as well. For now this is assumed to be left out.
    const existingUrlDoc = await this.urlRepo.findUrlWithHash(hash);
    return existingUrlDoc ? existingUrlDoc : null;
  }

  public async generateShortUrl(
    longUrl: string,
    hash: string,
    attempts = 0,
  ): Promise<UrlDocument> {
    return new Promise(async resolve => {
      const shortUrl = this.getShortUrl();

      try {
        const savedUrl: UrlDocument = await this.urlRepo.saveUrl({
          longUrl,
          shortUrl,
          hash,
        });
        return resolve(savedUrl);
      } catch (error) {
        console.log('Possible Collision');
        if (error.code === 11000 && attempts < 3) {
          // mongo error due to collision
          // try to get a new short url
          return await this.generateShortUrl(longUrl, hash, attempts + 1);
        }
        throw error;
      }
    });
  }
}

// import base62 from 'base62';
// sample for another approach using the base62
// of the md5 hash of the url.
// function first43bits2(hashStr: string) {
//   let toConvertBits = '';
//   for (let i = 0; i <= 6; i++) {
//     const binary = hashStr.charCodeAt(i).toString(2);
//     toConvertBits += binary;
//   }
//   toConvertBits = toConvertBits.substr(0, 42);
//   const decimalNum = parseInt(toConvertBits, 2);
//   const base62Version = base62.encode(decimalNum);
// }
