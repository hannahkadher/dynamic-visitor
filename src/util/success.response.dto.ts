import { BaseResponseDto } from './base.response.dto';

/**
 * DTO for successful API responses.
 * @typeparam Type - The type of the data payload.
 */
export class SuccessResponseDto<Type> implements BaseResponseDto {
    // HTTP status code for the response.
    code: number;

    // Data payload of the response.
    data: Type;

    // Message providing information about the response.
    message: string;

    /**
     * Constructor for SuccessResponseDto.
     * @param input - BaseResponseDto containing input properties.
     */
    constructor(input: BaseResponseDto) {
        // If 'code' is provided in the input, use it; otherwise, default to 200.
        if (input.code) this.code = input.code;
        else this.code = 200;

        // If 'data' is provided in the input, assign it.
        if (input.data) this.data = input.data;

        // Assign the 'message' property.
        this.message = input.message;
    }
}
