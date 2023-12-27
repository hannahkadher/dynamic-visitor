import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class FormData extends Document {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  formTemplateId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, type: Object })
  formData: Record<string, any>;
}

export const FormDataSchema = SchemaFactory.createForClass(FormData);
