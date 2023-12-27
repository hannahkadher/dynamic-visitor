import { WithOptional } from './optional.type';

/**
 * Base DTO for API responses.
 */
export class BaseResponseDto {
    // Optional HTTP status code.
    code?: number;

    // Required message providing information about the response.
    message: string;

    // Optional error message in case of failure.
    error?: string;

    // Optional data payload.
    data?: any;

    /**
     * Static method to create a response object.
     * @param options - Object containing response properties.
     * @returns BaseResponseDto instance.
     */
    static wrap({
        data,
        code = 200,
        message = 'Success',
        error = undefined,
    }: WithOptional<BaseResponseDto, 'message'>) {
        return { data, code, message, error };
    }
}
