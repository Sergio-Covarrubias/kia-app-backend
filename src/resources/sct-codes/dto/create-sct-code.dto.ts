import { IsString, Length } from 'class-validator';

export class CreateSctCodeDto {
    @IsString() @Length(20, 30)
    code: string;
}
