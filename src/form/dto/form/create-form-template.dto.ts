import { IsString, IsArray, ArrayMinSize, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data transfer object (DTO) for creating a new form template.
 * Used to validate incoming data for creating form templates.
 */
export class CreateFormTemplateDto {
  /**
   * The name of the form template.
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'name',
    required: true,
    description: 'Name of the form template',
    example: 'Test',
    type: 'string'
  })
  name: string;

  /**
   * An array of fields in the form template.
   * Each field should have a name, type, and required flag.
   */
  @IsArray()
  @ArrayMinSize(1)
  @ApiProperty({
    name: 'Fields',
    required: true,
    description: 'Form Fields name, type, required',
    example: [
      {
        name: 'name',
        type: 'string',
        required: true
      }
    ],
    type: 'Array'
  })
  fields: Array<{ name: string; type: string; required: boolean }>;
}