import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
    @IsString() @IsNotEmpty()
    corporateId: string;

    @IsString() @IsNotEmpty()
    password: string;

    @IsBoolean() @IsNotEmpty()
    isAdmin: boolean;
}
