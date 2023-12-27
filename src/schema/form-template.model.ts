import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class FormTemplate extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    type: [
      {
        name: { type: String, required: true },
        type: { type: String, required: true },
        required: { type: Boolean, required: true },
      },
    ],
  })
  fields: {
    name: string;
    type: string;
    required: boolean;
  }[];
}

export const FormTemplateSchema = SchemaFactory.createForClass(FormTemplate);
