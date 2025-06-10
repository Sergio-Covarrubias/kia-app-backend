import { IsString, Length } from 'class-validator';

export class CreateContainerDto {
  @IsString() @Length(1, 255)
  name: string;

  @IsString() @Length(1, 255)
  capacity: string;
}
