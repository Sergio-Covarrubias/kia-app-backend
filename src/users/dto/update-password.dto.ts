import { Length, IsString } from 'class-validator';

export class UpdatePasswordDto {
  @IsString() @Length(8)
  password: string;
}
