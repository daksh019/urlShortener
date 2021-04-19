// import { ApiProperty } from '@nestjs/swagger';
// import { IsDefined, IsNumber, IsPositive } from 'class-validator';

export class UrlDto {
  // @ApiProperty({
  //   description:
  //     'Amount is charged without a decimal place e.g. $1.5 = 150. Currencies can have different decimals/exponentials, see Currencies Section for more details. For Account Verification transactions, provide 0 as value for this field.',
  //   type: 'integer',
  //   example: 0,
  // })
  // @IsNumber()
  // @IsPositive()
  // @IsDefined()
  longUrl: string;
  shortUrl: string;
  hash: string;
}
