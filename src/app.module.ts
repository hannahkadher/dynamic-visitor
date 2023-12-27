import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FormModule } from './form/form.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/dynamic-visitor-forms'),
    FormModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
