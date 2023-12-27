import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { FormService } from '../src/form/form.service';

// Import models and interfaces
import { FormTemplate, FormTemplateSchema } from '../src/schema/form-template.model';
import { FormTemplateData } from '../src/form/interfaces/form-template-data.interface';
import mongoose, { Document } from 'mongoose';
import { FormModule } from '../src/form/form.module'
import { FormData, FormDataSchema } from '../src/schema/form-data.model';
import { AppModule } from '../src/app.module';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { FormDataInput } from 'src/form/interfaces/submit-data-interface';


// Create a test suite for the FormService class


describe('FormService', () => {
  let formService: FormService;

  const mockFormTemplateModel = {
    findById: jest.fn(),
    save: jest.fn(),
  };

  const mockFormDataModel = {
    save: jest.fn(),
  };


  // Set up the testing module and inject the dependencies
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [FormModule, AppModule],
      providers: [
        FormService,
        {
          provide: getModelToken(FormTemplate.name),
          useValue: mongoose.model(FormTemplate.name, FormTemplateSchema), // Use the schema directly
        },
        {
          provide: getModelToken(FormData.name),
          useValue: mongoose.model<Document>('FormData', FormDataSchema),
        },
      ],
    }).compile();

    formService = module.get<FormService>(FormService);
  });

  afterEach(async () => {
    // Disconnect from the MongoDB database
    await mongoose.disconnect();
  });


  it('should be defined', () => {
    expect(formService).toBeDefined();
  });


  describe('createFormTemplate', () => {

    it('should throw BadRequestException on error of empty name', async () => {
      // Arrange
      const formData: FormTemplateData = {
        name: '',
        fields: [
          { name: 'field1', type: 'string', required: true },
          { name: 'field2', type: 'number', required: false },
        ],
      };

      const saveSpy = jest
        .spyOn(mongoose.model(FormTemplate.name, FormTemplateSchema).prototype, 'save')
        .mockRejectedValue(new Error('Some error'));

      // Act & Assert
      await expect(formService.createFormTemplate(formData)).rejects.toThrow(BadRequestException);

      // Restore the original behavior to avoid interference with other tests
      saveSpy.mockRestore();
    });

    it('should create a form template successfully', async () => {
      // Arrange
      const formData: FormTemplateData = {
        name: 'Test Form',
        fields: [
          { name: 'field1', type: 'string', required: true },
          { name: 'field2', type: 'number', required: false },
        ],
      };

      const saveSpy = jest
        .spyOn(mongoose.model(FormTemplate.name, FormTemplateSchema).prototype, 'save')
        .mockResolvedValueOnce({ _id: 'generatedId', ...formData } as FormTemplate);

      // Act
      const result = await formService.createFormTemplate(formData);

      // Assert
      expect(result.code).toEqual(200);
      expect(result.message).toEqual('Form template created successfully');
      expect(result.data.name).toEqual(formData.name);
      // Restore the original behavior to avoid interference with other tests
      saveSpy.mockRestore();
    });

    it('should throw BadRequestException error on field type is not valid', async () => {
      // Arrange
      const formData: FormTemplateData = {
        name: 'Test Form',
        fields: [
          { name: 'field1', type: 'string', required: true },
          { name: 'field2', type: 'test', required: false },
        ],
      };

      const saveSpy = jest
        .spyOn(mongoose.model(FormTemplate.name, FormTemplateSchema).prototype, 'save')
        .mockRejectedValue(new Error('Some error'));

      // Act & Assert
      await expect(formService.createFormTemplate(formData)).rejects.toThrow(BadRequestException);

      // Restore the original behavior to avoid interference with other tests
      saveSpy.mockRestore();
    });

    it('should throw BadRequestException for empty form data', async () => {
      const formData = {
        name: '',
        fields: [],
      };

      await expect(formService.createFormTemplate(formData)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getFormTemplate', () => {
    it('should return a form template when a valid ID is provided', async () => {
      // Arrange
      const mockObjectId = '5f4d9f5463a2bc3f845b9712';

      // Mock the findById method to resolve with the mockFormTemplate
      jest.spyOn(formService['formTemplateModel'], 'findById').mockResolvedValueOnce({
        // mock the properties of the form template
        _id: mockObjectId,
        name: 'Test Form',
        fields: [
          {
            name: 'field1',
            type: 'string',
            required: true,
          },
        ]
      });

      // Test the getFormTemplate method
      const result = await formService.getFormTemplate(mockObjectId);

      expect(result.code).toEqual(200);
      expect(result.message).toEqual("Form template retrieved successfully");
    });

    it('should throw NotFoundException for non-existent form template', async () => {

      const nonExistentObjectId = '6081a6c60a133d4ac6fb1765';
      jest.spyOn(formService['formTemplateModel'], 'findById').mockResolvedValueOnce(null);

      await expect(formService.getFormTemplate(nonExistentObjectId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('submitFormData', () => {

    it('should submit form data successfully', async () => {

      let templateId = new mongoose.Types.ObjectId();
      // Arrange
      const formDataInput: FormDataInput = {
        formTemplateId: templateId.toString(),
        formData: { field1: 'John Doe' },
      };

      const mockFormTemplate = {
        _id: templateId,
        fields: [{ name: 'field1', type: 'string', required: true }],
      } as FormTemplate;

      jest.spyOn(formService['formTemplateModel'], 'findById').mockResolvedValueOnce(mockFormTemplate);

      const mockSavedFormData = {
        _id: 'someUniqueId',
        formTemplateId: formDataInput.formTemplateId,
        formData: formDataInput.formData,
      } as unknown as FormData;


      mockFormDataModel.save.mockResolvedValueOnce(mockSavedFormData);

      // Act
      const result = await formService.submitFormData(formDataInput);

      // Assert
      expect(result.code).toEqual(200);
      expect(result.message).toEqual('Form data submitted successfully');

    });


    it('should throw NotFoundException when form template ID is not found', async () => {
      // Arrange
      const formDataInput = {
        formTemplateId: '65872801bf5204ef3b08a98a',
        formData: {
          field1: 'John Doe',
        },
      };

      // Mock the findById method to resolve with null, simulating the scenario where the form template is not found
      jest.spyOn(formService['formTemplateModel'], 'findById').mockResolvedValueOnce(null);

      // Act & Assert
      await expect(formService.submitFormData(formDataInput)).rejects.toThrow(NotFoundException);

    });

    it('should throw InternalServerErrorException on error saving form data', async () => {

      const mockFormTemplate = {
        _id: '5f4d9f5463a2bc3f845b9712',
        name: 'Test Form',
        fields: [
          {
            name: 'field1',
            type: 'string',
            required: true,
          },
        ],
      };
      // Arrange
      const formDataInput = {
        formTemplateId: '5f4d9f5463a2bc3f845b9712',
        formData: {
          field1: 'John Doe',
        },
      };

      // Mock the findById method and save method to simulate an error during save
      jest.spyOn(formService['formTemplateModel'], 'findById').mockResolvedValueOnce(mockFormTemplate);
      jest.spyOn(formService['formDataModel'].prototype, 'save').mockRejectedValueOnce(new Error('Mock save error'));

      // Act & Assert
      await expect(formService.submitFormData(formDataInput)).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw BadRequestException when form data does not match the form template', async () => {
      // Arrange
      const formDataInput = {
        formTemplateId: '6081a6c60a133d4ac6fb1765',
        formData: {
          // Some fields that do not match the form template
          invalidField: 'Invalid Field',
        },
      };

      // Mock the findById method and a form template that has different fields
      const mockFormTemplate = {
        _id: '6081a6c60a133d4ac6fb1765',
        fields: [
          {
            "field1": "name",
            "type": "string",
            "required": true
          }
        ],
      };
      jest.spyOn(formService['formTemplateModel'], 'findById').mockResolvedValueOnce(mockFormTemplate);

      // Act & Assert
      await expect(formService.submitFormData(formDataInput)).rejects.toThrow(BadRequestException);
    });


  });

  afterAll(async () => {
    await mongoose.disconnect();
    jest.restoreAllMocks();
  });

});

