import { IsString, Length } from 'class-validator';

export class CreateProviders2Dto {
    @IsString() @Length(1, 255)
    name: string;

    @IsString() @Length(10, 20)
    authorizationCode: string;
}
