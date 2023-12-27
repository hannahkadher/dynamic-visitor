import { ApiProperty } from '@nestjs/swagger';

export class CreateFormDataDto {
  /**
   * The form data to be submitted as key-value pairs.
   */
  @ApiProperty({
    required: true,
    description: 'Form data in a key-value format',
    example: {
      name: 'John Doe',
      email: 'john@example.com'
    },
    type: 'object',
  })
  formData: Record<string, any>;
}