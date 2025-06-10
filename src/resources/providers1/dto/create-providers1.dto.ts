import { IsString, Length } from 'class-validator';

export class CreateProviders1Dto {
  @IsString() @Length(1, 255)
  name: string;

  @IsString() @Length(10, 15)
  semarnatCode: string;

  @IsString() @Length(1, 255)
  address: string;

  @IsString() @Length(1, 255)
  phone: string;
}
