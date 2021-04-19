import { HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsBoolean } from 'class-validator';
import { ValidationPipe } from './validation.pipe';

class TestData {
  @IsBoolean()
  isFlag: boolean;
}

describe('Pipes - ValidationPipe', () => {
  const pipe = new ValidationPipe();

  it('should fail if value type does not match metatype', async () => {
    let err;

    const testDataPoint = new TestData();
    // @ts-ignore
    testDataPoint.isFlag = 'string';

    try {
      await pipe.transform(
        testDataPoint,
        // @ts-ignore
        {
          // @ts-ignore
          metatype: TestData,
        },
      );
    } catch (error) {
      err = error.response;
      err.code = error.status;
    } finally {
      expect(err.code).toEqual(HttpStatus.BAD_REQUEST);
    }
  });
});
