import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { UrlService } from '@url-svcs/url/services/url-service/url-service.service';
import { UrlRepo } from '@url-svcs/url/repositories/url-repo';
import { IUrlResponse } from '@url-svcs/url/interfaces/url.response.interface';
import { isEmpty } from 'lodash';
import { UrlDocument } from '@url-svcs/url/repositories/url-schema';
import { UrlDto } from '@url-svcs/url/dto/url.dto';
import { ValidationPipe } from '@url-svcs/url/pipes/validation.pipe';
import { AppConfigService } from '@url-svcs/core/config/config.service';

@Controller('url')
export class UrlShortenerController {
  constructor(
    private urlSvc: UrlService,
    private urlRepo: UrlRepo,
    private config: AppConfigService,
  ) {}
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
  async createTinyUrl(
    @Body(new ValidationPipe()) urlDto: UrlDto,
  ): Promise<IUrlResponse> {
    const { shortUrl, longUrl } = urlDto;
    const baseUrl = this.config.baseUrl;

    const hash = this.urlSvc.getHash(longUrl);
    const existingTinyUrl = await this.urlSvc.getIfExists(hash);

    if (existingTinyUrl) {
      return {
        longUrl,
        shortUrl: `${baseUrl}${existingTinyUrl.shortUrl}`,
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
        shortUrl: `${baseUrl}${urlDoc.shortUrl}`,
      };
    } else {
      try {
        // it is important to attempt a save here.
        // to get a collision in case of duplicate generation.
        const savedUrl: UrlDocument = await this.urlRepo.saveUrl({
          longUrl,
          shortUrl,
          hash,
        });

        return {
          longUrl,
          shortUrl: `${baseUrl}${savedUrl.shortUrl}`,
        };
      } catch (error) {
        if (error.code === 11000) {
          // possible security issue, once can make attempts to guess the
          // short urls in use.
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
    const baseUrl = this.config.baseUrl;

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
        shortUrl: `${baseUrl}${savedUrl.shortUrl}`,
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
