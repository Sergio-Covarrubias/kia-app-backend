import { IsString, Length, IsNotEmpty } from 'class-validator';

export class GenerateManifestDto {
  @IsString() @Length(10, 10)
  exitDate: string;

  @IsString() @Length(1, 255)
  provider1: string;

  @IsString() @Length(1, 255)
  provider2: string;

  @IsString() @Length(20, 30)
  sctCode: string;

  @IsString() @Length(1, 255)
  manager: string;

  @IsString() @IsNotEmpty()
  manifestCode: string;
  
  @IsString() @IsNotEmpty()
  driver: string;

  @IsString() @Length(6, 8)
  plateCode: string;
}
