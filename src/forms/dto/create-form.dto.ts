import { IsString, IsNumber, IsPositive, IsDate, Length, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class FormDto {
    @IsString() @Length(1, 255)
    name: string;

    @IsString() @Length(1, 255) @IsOptional()
    container: string;

    @IsNumber() @IsPositive()
    @Transform(({ value }: { value: string }) => parseFloat(value))
    tons: number;

    @IsString() @Length(1, 255)
    area: string;

    @IsDate()
    @Transform(({ value }: { value: string }) => new Date(value))
    entryDate: Date;

    @IsDate() @IsOptional()
    @Transform(({ value }: { value: string | null }) => value === null ? null : new Date(value))
    exitDate: Date | null;

    @IsString() @Length(1, 255)
    processingStage: string;

    @IsString() @Length(1, 255)
    provider1: string;

    @IsString() @Length(20, 30)
    sctCode: string;

    @IsString() @Length(1, 255)
    provider2: string;

    @IsString() @Length(1, 255)
    manager: string;
}
