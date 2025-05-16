import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @IsString() @IsNotEmpty()
    corporateId: string;

    @IsString() @IsNotEmpty()
    password: string;
}
