import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';

/**
 * Data transfer object (DTO) for retrieving a form template by its ID.
 * Used to validate incoming data when fetching form templates.
 */
export class GetFormTemplateDto {
    /**
     * The ID of the form template to retrieve.
     */
    @IsNotEmpty()
    @IsDefined()
    @ApiProperty({
      name: 'id', // Corrected name property
      required: true,
      description: 'Id of the form template',
      example: '5f58954a1b54a754f315c549', 
    })
    id: string;
}