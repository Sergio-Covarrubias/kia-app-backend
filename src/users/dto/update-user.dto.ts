import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsBoolean() @IsNotEmpty()
  isAdmin: boolean;
}
