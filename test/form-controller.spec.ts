import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { FormService } from '../src/form/form.service';

// Import models and interfaces
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FormController } from '../src/form/form.controller';
import { CreateFormTemplateDto } from '../src/form/dto/form/create-form-template.dto';
import { FormTemplate, FormTemplateSchema } from '../src/schema/form-template.model';
import mongoose, { Document, Types } from 'mongoose';
import { FormDataSchema } from '../src/schema/form-data.model';
import { SuccessResponseDto } from '../src/util/success.response.dto';
import { GetFormTemplateDto } from '../src/form/dto/form/get-form-template.dto';
import { CreateFormDataDto } from '../src/form/dto/form-data/create-form-data.dto';

describe('FormController', () => {
    let formController: FormController;
    let formService: FormService;


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            //imports: [FormModule, AppModule],
            controllers: [FormController],
            providers: [FormService, {
                provide: getModelToken(FormTemplate.name),
                useValue: mongoose.model(FormTemplate.name, FormTemplateSchema), // Use the schema directly
            },
                {
                    provide: getModelToken(FormData.name),
                    useValue: mongoose.model<Document>('FormData', FormDataSchema),
                },],
        }).compile();

        formController = module.get<FormController>(FormController);
        formService = module.get<FormService>(FormService);
    });

    afterEach(async () => {
        // Disconnect from the MongoDB database
        jest.clearAllMocks();
        await mongoose.disconnect();
    });
    afterAll(async () => {
        await mongoose.disconnect();
        jest.restoreAllMocks();
    });

    it('should be defined', () => {
        expect(formController).toBeDefined();
    });

    describe('createFormTemplate', () => {
        it('should throw BadRequestException on validation error', async () => {
            const mockCreateFormTemplateDto: CreateFormTemplateDto = {
                name: 'k1',
                fields: [
                    { name: 'name', type: 'invalidType', required: true },
                ],
            };

            jest.spyOn(formService, 'createFormTemplate').mockRejectedValueOnce(new BadRequestException('Invalid field type'));

            await expect(formController.createFormTemplate(mockCreateFormTemplateDto)).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException on validation error', async () => {
            const mockCreateFormTemplateDto: CreateFormTemplateDto = {
                // Invalid name to trigger a validation error
                name: '',
                fields: [
                    { name: 'name', type: 'invalidType', required: true },
                ],
            };
            // Mock FormService to throw a BadRequestException
            jest.spyOn(formService, 'createFormTemplate').mockRejectedValueOnce(new BadRequestException('Invalid field type'));

            // Act & Assert
            await expect(formController.createFormTemplate(mockCreateFormTemplateDto)).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException on validation error', async () => {
            // Arrange
            const mockCreateFormTemplateDto: CreateFormTemplateDto = {
                // Invalid name to trigger a validation error
                name: 'test',
                fields: [
                ],
            };
            // Mock FormService to throw a BadRequestException
            jest.spyOn(formService, 'createFormTemplate').mockRejectedValueOnce(new BadRequestException('Invalid field type'));

            // Act & Assert
            await expect(formController.createFormTemplate(mockCreateFormTemplateDto)).rejects.toThrow(BadRequestException);
        });
        it('should create a new form template successfully', async () => {
            // Arrange
            const mockObjectId = new Types.ObjectId(); // Generate a mock ObjectId
            const mockCreateFormTemplateDto: CreateFormTemplateDto = {
                name: 'Test Form',
                fields: [
                    { name: 'Field1', type: 'string', required: true },
                    { name: 'Field2', type: 'number', required: false },
                ],
            };

            const mockSuccessResponse: SuccessResponseDto<any> = {
                code: 200,
                data: {
                    _id: mockObjectId, // Include the mock ObjectId in the response
                    name: 'Test Form',
                    fields: [
                        { name: 'Field1', type: 'string', required: true },
                        { name: 'Field2', type: 'number', required: false },
                    ],
                    // Additional properties as needed
                },
                message: 'Form template created successfully',
            };

            // Mock the createFormTemplate method
            jest.spyOn(formService, 'createFormTemplate').mockResolvedValueOnce(mockSuccessResponse);

            // Act
            const result = await formController.createFormTemplate(mockCreateFormTemplateDto);

            // Assert
            expect(result).toEqual(mockSuccessResponse);

            // Ensure that the createFormTemplate method was called with the correct arguments
            expect(formService.createFormTemplate).toHaveBeenCalledWith(mockCreateFormTemplateDto);
        });
    });

    describe('getFormTemplate', () => {
        it('should get a form template by ID successfully', async () => {

            const existingFormTemplateId = 'existingFormTemplateId';
            const mockGetFormTemplateDto: GetFormTemplateDto = { id: existingFormTemplateId };

            // Mock the getFormTemplate method to return a promise that resolves to the mocked response
            const mockedResponse = {
                _id: existingFormTemplateId,
                name: 'Test Form',
                fields: [
                    { name: 'Field1', type: 'string', required: true, _id: 'someFieldId1' },
                    { name: 'Field2', type: 'number', required: false, _id: 'someFieldId2' },
                ],
                __v: 0,
            };

            jest.spyOn(formService, 'getFormTemplate').mockResolvedValueOnce(
                Promise.resolve<SuccessResponseDto<any>>({
                    code: 200,
                    data: mockedResponse,
                    message: 'Form template retrieved successfully',
                })
            );

            const result = await formController.getFormTemplate(mockGetFormTemplateDto);

            // Assert
            const expectedResult: SuccessResponseDto<any> = {
                code: 200,
                data: mockedResponse,
                message: 'Form template retrieved successfully',
            };

            expect(result).toEqual(expectedResult);
            expect(formService.getFormTemplate).toHaveBeenCalledWith(existingFormTemplateId);
        });
        it('should throw a NotFoundException when form template is not found', async () => {

            const nonExistingFormTemplateId = 'nonexistentId';
            const mockGetFormTemplateDto: GetFormTemplateDto = { id: nonExistingFormTemplateId };
            jest.spyOn(formService, 'getFormTemplate').mockRejectedValueOnce(new NotFoundException('Form template not found'));

            await expect(formController.getFormTemplate(mockGetFormTemplateDto)).rejects.toThrow(NotFoundException);

            expect(formService.getFormTemplate).toHaveBeenCalledWith(nonExistingFormTemplateId);
        });
    });

    describe('submitFormData', () => {
        it('should submit form data successfully', async () => {

            const mockFormData: CreateFormDataDto = {
                formData: {
                    field1: 'John Doe',
                },
            };

            const mockFormTemplateId = 'validObjectId';

            // Mock the submitFormData method to resolve with a success response
            jest.spyOn(formService, 'submitFormData').mockResolvedValueOnce({
                code: 200,
                data: mockFormData.formData,
                message: 'Form data submitted successfully',
            } as SuccessResponseDto<any>);


            const result = await formController.submitFormData({ id: mockFormTemplateId }, mockFormData);


            expect(result).toEqual({
                code: 200,
                data: mockFormData.formData,
                message: 'Form data submitted successfully',
            });

            // Ensure that the submitFormData method was called with the correct arguments
            expect(formService.submitFormData).toHaveBeenCalledWith({
                formTemplateId: mockFormTemplateId,
                formData: mockFormData.formData,
            });
        });

        it('should throw NotFoundException when form template ID is not found', async () => {

            const nonExistingFormTemplateId = 'nonexistentId';
            const mockFormData: CreateFormDataDto = {
                formData: {
                    field1: 'John Doe',
                },
            };

            // Mock the submitFormData method to throw a NotFoundException
            jest.spyOn(formService, 'submitFormData').mockRejectedValueOnce(new NotFoundException('Form template not found'));

            await expect(formController.submitFormData({ id: nonExistingFormTemplateId }, mockFormData)).rejects.toThrow(
                NotFoundException,
            );

            // Ensure that the submitFormData method was called with the correct arguments
            expect(formService.submitFormData).toHaveBeenCalledWith({
                formTemplateId: nonExistingFormTemplateId,
                formData: mockFormData.formData,
            });
        });

        it('should throw BadRequestException on form data validation error', async () => {

            const mockFormData: CreateFormDataDto = {
                formData: {
                    field1: 'John Doe',
                },
            };

            const mockFormTemplateId = 'validObjectId';

            // Mock the submitFormData method to throw a BadRequestException
            jest.spyOn(formService, 'submitFormData').mockRejectedValueOnce(new BadRequestException('Form data validation failed'));

            await expect(formController.submitFormData({ id: mockFormTemplateId }, mockFormData)).rejects.toThrow(
                BadRequestException,
            );


            expect(formService.submitFormData).toHaveBeenCalledWith({
                formTemplateId: mockFormTemplateId,
                formData: mockFormData.formData,
            });
        });
    });
});

