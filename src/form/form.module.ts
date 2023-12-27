import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FormController } from './form.controller';
import { FormService } from './form.service';
import { FormData, FormDataSchema } from '../schema/form-data.model';
import {
  FormTemplate,
  FormTemplateSchema,
} from '../schema/form-template.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FormTemplate.name, schema: FormTemplateSchema },
      { name: FormData.name, schema: FormDataSchema },
    ]),
  ],
  controllers: [FormController],
  providers: [FormService],
})
export class FormModule {}
