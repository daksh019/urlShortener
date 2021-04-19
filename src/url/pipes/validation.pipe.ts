import {
  ArgumentMetadata,
  Injectable,
  Type,
  ValidationPipe as NestJsValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

@Injectable()
export class ValidationPipe extends NestJsValidationPipe {
  constructor() {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.canValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);

    const errors: ValidationError[] = await validate(object);

    if (errors.length > 0) {
      throw new BadRequestException({
        details: errors,
      });
    }
    return object;
  }

  private canValidate(metatype: Type<any>): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find(type => metatype === type);
  }
}
