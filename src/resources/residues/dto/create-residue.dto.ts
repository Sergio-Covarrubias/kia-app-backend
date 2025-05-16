import { IsString, Length } from 'class-validator';

export class CreateResidueDto {
    @IsString() @Length(1, 255)
    name: string;

    @IsString() @Length(10, 10)
    materials: string;
}
