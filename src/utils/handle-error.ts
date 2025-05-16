import { BadRequestException, InternalServerErrorException } from "@nestjs/common";

export const createError = <T extends new (data: { type: string, message: string }) => InstanceType<T>>(ErrorClass: T, type: string, message: string): InstanceType<T> => {
    return new ErrorClass({ type, message });
};

export const handleError = (error: any) => {
    if (error instanceof BadRequestException) {
        throw error;
    }

    console.error(error);
    throw new InternalServerErrorException({
        type: 'internal',
        message: error.message || 'Unexpected error',
    });
};
