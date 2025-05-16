import { IsString, Length } from 'class-validator';

export class CreateAreaDto {
    @IsString() @Length(1, 255)
    name: string;
}
