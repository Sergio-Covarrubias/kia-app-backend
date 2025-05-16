import { IsString, Length } from 'class-validator';

export class CreateManagerDto {
    @IsString() @Length(1, 255)
    name: string;
}
