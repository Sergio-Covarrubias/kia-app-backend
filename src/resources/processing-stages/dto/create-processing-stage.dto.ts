import { IsString, Length } from 'class-validator';

export class CreateProcessingStageDto {
    @IsString() @Length(1, 255)
    name: string;
}
