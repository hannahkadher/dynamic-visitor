/**
 * form.service.ts
 * 
 * This service handles operations related to form templates and form data.
 */

import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { FormTemplate } from '../schema/form-template.model';
import { FormData } from '../schema/form-data.model';
import { FormField, FormTemplateData } from './interfaces/form-template-data.interface';
import { SuccessResponseDto } from '../util/success.response.dto';
import { BaseResponseDto } from 'src/util/base.response.dto';
import { FormDataInput } from './interfaces/submit-data-interface';

@Injectable()
export class FormService {
  private readonly logger = new Logger(FormService.name);

  constructor(
    @InjectModel(FormTemplate.name)
    private readonly formTemplateModel: Model<FormTemplate>,
    @InjectModel(FormData.name) private readonly formDataModel: Model<FormData>,
  ) { }

  /**
   * Create a new form template.
   * 
   * @param formData - Data for creating a form template.
   * @returns The created form template.
   * @throws InternalServerErrorException if the form template data is invalid.
   */
  async createFormTemplate(formData: FormTemplateData): Promise<BaseResponseDto> {
    const validFieldTypes = ['string', 'number', 'boolean', 'array'];

    for (const field of formData.fields) {
      if (!validFieldTypes.includes(field.type)) {
        throw new BadRequestException(`Invalid field type: ${field.type}`);
      }
    }

    try {
      const createdForm = new this.formTemplateModel({
        name: formData.name,
        fields: formData.fields,
      });

      const savedForm: FormTemplate = await createdForm.save();

      return new SuccessResponseDto<FormTemplate>({
        data: savedForm,
        message: 'Form template created successfully',
      });
    } catch (error: any) {
      this.handleServiceError(error, 'Error creating form template');
    }
  }

  /**
   * Get a form template by its ID.
   * 
   * @param id - The ID of the form template.
   * @returns The form template or null if not found.
   * @throws BadRequestException if the form template ID is invalid.
   */
  async getFormTemplate(id: string): Promise<BaseResponseDto> {
    try {
      const objectId = new mongoose.Types.ObjectId(id);


      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid ObjectId format for form template ID');
      }

      const formTemplate = await this.formTemplateModel.findById(objectId);

      if (!formTemplate) {
        this.handleFormTemplateNotFound(id);;
      }

      return new SuccessResponseDto<FormTemplate>({
        data: formTemplate,
        message: 'Form template retrieved successfully',
      });

    } catch (error: any) {
      this.handleServiceError(error, `Error getting form template: ${id}`);
    }
  }

  /**
   * Submit form data for a given form template ID.
   * 
   * @param formTemplateId - The ID of the form template.
   * @param formData - Data to be submitted.
   * @returns The submitted form data.
   * @throws BadRequestException if the form data is invalid.
   * @throws NotFoundException if the form template is not found.
   */
  async submitFormData(formDataInput: FormDataInput): Promise<BaseResponseDto> {
    const { formTemplateId, formData } = formDataInput;

    try {
      const objectId = new mongoose.Types.ObjectId(formTemplateId);
      const formTemplate = await this.formTemplateModel.findById(objectId);

      if (!formTemplate) {
        this.handleFormTemplateNotFound(formTemplateId);
      }

      this.validateFormData(formData, formTemplate.fields);

      const createdFormData = new this.formDataModel({ formTemplateId: formTemplate._id, formData });
      const savedFormData = await createdFormData.save();

      if (!savedFormData) {
        throw new InternalServerErrorException('Error saving form data');
      }

      return new SuccessResponseDto<FormTemplate>({
        data: savedFormData,
        message: 'Form data submitted successfully'
      });

    } catch (error: any) {
      this.handleServiceError(error, `Error submitting form data: ${formTemplateId}`);
    }
  }

  /**
   * Validate form data against the specified form fields.
   * 
   * @param formData - Form data to be validated.
   * @param formFields - Form fields to validate against.
   * @throws BadRequestException if the form data is invalid.
   */
  private validateFormData(formData: Record<string, any>, formFields: FormField[]): void {
    const allowedKeys = new Set(formFields.map((field) => field.name));


    for (const field of formFields) {
      const submittedValue = formData[field.name];

      // Check if the field is missing in formData
      if (field.required && submittedValue === undefined) {
        throw new BadRequestException(`Missing required field: ${field.name}`);
      }

      // Check if the field type matches the submitted value type
      if (submittedValue !== undefined && typeof submittedValue !== field.type) {
        throw new BadRequestException(`Invalid type for field ${field.name}. Expected ${field.type}`);
      }
    }

    const extraKeys = Object.keys(formData).filter((key) => !allowedKeys.has(key));
    if (extraKeys.length > 0) {
      throw new BadRequestException(`Invalid form data. Extra keys found: ${extraKeys.join(', ')}`);
    }
  }

  private handleServiceError(error: any, message: string): never {
    if (error instanceof mongoose.Error.ValidationError || error instanceof BadRequestException) {
      throw new BadRequestException(error.message);
    } else if (error instanceof NotFoundException) {
      throw new NotFoundException(error.message);
    } else {
      this.logger.error(`${message}: ${error.message}`);
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  private handleFormTemplateNotFound(id: string): never {
    const errorMessage = `Form template not found for ID: ${id}`;
    this.logger.error(errorMessage);
    throw new NotFoundException(errorMessage);
  }
}
