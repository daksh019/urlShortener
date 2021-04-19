import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UrlRepo } from '@url-svcs/url/repositories/url-repo';
import { UrlDocument } from '@url-svcs/url/repositories/url-schema';
import { UrlService } from '@url-svcs/url/services/url-service/url-service.service';

@Controller('')
export class UrlRedirectController {
  constructor(private urlSvc: UrlService, private urlRepo: UrlRepo) {}

  @Get(':shortUrl')
  async redirectToLongUrl(
    @Param('shortUrl') shortUrl: string,
    @Res() response: Response,
  ): Promise<void> {
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
      response.redirect(savedUrl.longUrl);
    }
  }
}
