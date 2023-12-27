import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // Initialize the NestJS application before running tests
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {

    await app.close();
  });

  it('POST /form', () => {

    const formData = {
      name: 'Test Form',
      fields: [
        { name: 'Field1', type: 'string', required: true },
        { name: 'Field2', type: 'number', required: false },
      ],
    };

    return request(app.getHttpServer())
      .post('/form')
      .send(formData)
      .expect(HttpStatus.CREATED)
      .expect((res) => {

        expect(res.body.data.name).toEqual(formData.name);
      });
  });

  it('GET /form/:id', () => {

    const validObjectId = '65872801bf5204ef3b08a98a';

    return request(app.getHttpServer())
      .get(`/form/${validObjectId}`)
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.data._id).toEqual(validObjectId);
      });
  });

  it('POST /forms/:id/submit', () => {
    const validObjectId = '65872801bf5204ef3b08a98a';

    const formData = {
      name: "John Doe",
      email: "john@name.com"
    }

    return request(app.getHttpServer())
      .post(`/form/${validObjectId}/submit`)
      .send({ formData })
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        // Customize this based on your response structure
        expect(res.body.data.formTemplateId).toEqual(validObjectId);
        expect(res.body.data.formData.name).toEqual(formData.name);
      });
  });
});