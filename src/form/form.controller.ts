/**
 * form.controller.ts
 *
 * This controller handles HTTP requests related to form templates and form data.
 */

import { Body, Controller, Get, Param, Post, Logger } from '@nestjs/common';
import { CreateFormTemplateDto } from './dto/form/create-form-template.dto';
import { GetFormTemplateDto } from './dto/form/get-form-template.dto';
import { FormService } from './form.service';

import { ControllerRoute } from '../constants/controller-route';
import { FormDataInput } from './interfaces/submit-data-interface';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateFormDataDto } from './dto/form-data/create-form-data.dto';

/**
 * Controller responsible for handling HTTP requests related to form templates and form data.
 */
@ApiTags('Dynamic Visitor Form Controller')
@Controller(ControllerRoute.FORM_ROUTE)
export class FormController {
  private readonly logger = new Logger(FormController.name);

  constructor(private readonly formService: FormService) { }

  /**
   * Endpoint to create a new form template.
   *
   * @param formTemplate - Data for creating a form template.
   * @returns The created form template.
   */
  @Post()
  @ApiOperation({
    summary: ControllerRoute.ACTIONS.CREATE_TEMPLATE_SUMMARY,
    description: ControllerRoute.ACTIONS.CREATE_TEMPLATE_DESCRIPTION
  })
  @ApiBody({
    description: 'Provide name of the dynamic form, fields array with name, type and required values for each field',
    type: CreateFormTemplateDto
  })
  createFormTemplate(@Body() formTemplate: CreateFormTemplateDto) {
    return this.formService.createFormTemplate(formTemplate);
  }

  /**
   * Endpoint to get a form template by its ID.
   *
   * @param id - The ID of the form template.
   * @returns The form template or null if not found.
   */
  @Get('/:id')
  @ApiOperation({
    summary: ControllerRoute.ACTIONS.GET_TEMPLATE_BY_ID_SUMMARY,
    description: ControllerRoute.ACTIONS.GET_TEMPLATE_BY_ID_DESCRIPTION
  })
  getFormTemplate(@Param() params: GetFormTemplateDto) {
    return this.formService.getFormTemplate(params.id);
  }

  /**
   * Endpoint to submit form data for a given form template ID.
   *
   * @param params - Parameters containing the form template ID.
   * @param formData - Data to be submitted.
   * @returns The submitted form data.
   */
  @Post('/:id/submit')
  @ApiOperation({
    summary: ControllerRoute.ACTIONS.SUBMIT_FORM_DATA_SUMMARY,
    description: ControllerRoute.ACTIONS.SUBMIT_FORM_DATA_DESCRIPTION
  })
  @ApiBody({
    description: 'Provide name and value for the fields detailed in respective template ',
    type: CreateFormDataDto
  })
  submitFormData(@Param() params: GetFormTemplateDto, @Body() formDataDto: CreateFormDataDto) {
    const { id } = params;
    const formDataInput: FormDataInput = { formTemplateId: id, formData: formDataDto.formData};
    return this.formService.submitFormData(formDataInput);
  }
}