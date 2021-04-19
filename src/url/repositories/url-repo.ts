import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Url, UrlDocument } from '@url-svcs/url/repositories/url-schema';
import { UrlDto } from '@url-svcs/url/dto/url.dto';
import { Model } from 'mongoose';

@Injectable()
export class UrlRepo {
  constructor(@InjectModel(Url.name) private urlModel: Model<UrlDocument>) {}

  public async saveUrl(urlObject: UrlDto): Promise<UrlDocument> {
    const urlDoc = new this.urlModel(urlObject);
    return await urlDoc.save();
  }

  public async findLongUrl(shortUrl: string): Promise<UrlDocument | null> {
    const urlDoc = await this.urlModel.findOne({
      shortUrl,
    });
    // EventLogRepo.saveEvent({
    //   shortUrl,
    // });
    return urlDoc;
  }

  public async checkIfExists(shortUrl: string): Promise<UrlDocument> {
    const updatedUrlDoc = await this.urlModel.findOne(
      {
        shortUrl,
      },
      'shortUrl',
    );
    return updatedUrlDoc;
  }

  public async findUrlWithHash(hash: string): Promise<UrlDocument> {
    return await this.urlModel.findOne({
      hash,
    });
  }
}
