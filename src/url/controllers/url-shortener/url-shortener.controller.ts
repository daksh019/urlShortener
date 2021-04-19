import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Param,
} from '@nestjs/common';
import { Request } from 'express';
import { UrlService } from '@url-svcs/url/services/url-service/url-service.service';
import { UrlRepo } from '@url-svcs/url/repositories/url-repo';
import { IUrlResponse } from '@url-svcs/url/interfaces/url.response.interface';
import { isEmpty } from 'lodash';
import { UrlDocument } from '@url-svcs/url/repositories/url-schema';

@Controller('url')
export class UrlShortenerController {
  constructor(private urlSvc: UrlService, private urlRepo: UrlRepo) {}
  /**
   * A handler reponsible for returning a short url for a given long url.
   * Additionally a short url can also be given by the user.
   *
   * Checks if the same long url is already present with a short url.
   * If yes, returns the short url for the long url.
   * If not, attempts to accept the short url given by the user.
   *
   */
  @Post('tinyUrl')
  async createTinyUrl(@Req() request: Request): Promise<IUrlResponse> {
    const { shortUrl, longUrl } = request.body;

    if (!this.urlSvc.isValidLongUrl(longUrl)) {
      throw new BadRequestException({
        details: {
          message:
            'The long url is not valid. Make sure to specify http or www',
        },
      });
    }

    const hash = this.urlSvc.getHash(longUrl);
    const existingTinyUrl = await this.urlSvc.getIfExists(hash);

    if (existingTinyUrl) {
      return {
        longUrl,
        shortUrl: existingTinyUrl.shortUrl,
      };
    }

    if (isEmpty(shortUrl)) {
      const urlDoc: UrlDocument = await this.urlSvc.generateShortUrl(
        longUrl,
        hash,
        0,
      );
      return {
        longUrl,
        shortUrl: urlDoc.shortUrl,
      };
    } else {
      if (!this.urlSvc.isValidShortUrl(shortUrl)) {
        throw new BadRequestException({
          details: {
            message:
              'The short url is not valid. Specify an alphanumeric short url of seven characters',
          },
        });
      }

      try {
        const savedUrl: UrlDocument = await this.urlRepo.saveUrl({
          longUrl,
          shortUrl,
          hash,
        });

        return {
          longUrl,
          shortUrl: savedUrl.shortUrl,
        };
      } catch (error) {
        if (error.code === 11000) {
          throw new BadRequestException({
            details: {
              message: 'The short url is already taken',
            },
          });
        }
      }
    }
  }

  @Get('tinyUrl/:shortUrl')
  async getLongUrl(@Param('shortUrl') shortUrl: string): Promise<IUrlResponse> {
    console.log(shortUrl);
    if (!this.urlSvc.isValidShortUrl(shortUrl)) {
      throw new BadRequestException({
        response: {
          message: 'Bad Request. Specify a valid short url',
        },
      });
    }

    const savedUrl: UrlDocument = await this.urlRepo.findLongUrl(shortUrl);

    if (savedUrl) {
      return {
        longUrl: savedUrl.longUrl,
        shortUrl: savedUrl.shortUrl,
      };
    } else {
      throw new NotFoundException({
        response: {
          message: 'No record found with the given short url',
        },
      });
    }
  }
}
