import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class BinnacleDataDTO {
    @IsString() @IsNotEmpty()
    @IsIn(['day', 'month', 'year'])
    timeframe: 'day' | 'month' | 'year';

    @IsString() @IsNotEmpty()
    startDate: string;
}
