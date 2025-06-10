import { IsBoolean, IsNotEmpty, Length, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString() @IsNotEmpty()
  corporateId: string;

  @IsString() @Length(8)
  password: string;

  @IsBoolean() @IsNotEmpty()
  isAdmin: boolean;
}
