require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });

    test.skip('todos', async() => {

      const expectation = [
       
        {
          id: 4,
          task: 'drink tea',
          completed: false,
          owner_id: 2,
        },
        {
          id: 5,
          task: 'wash car',
          completed: false,
          owner_id: 2,
        },
        {
          id: 6,
          task: 'vacuum',
          completed: false,
          owner_id: 2,
        },
      ];



      await fakeRequest(app)
        .post('/api/todos')
        .send(expectation[0])
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      await fakeRequest(app)
        .post('/api/todos')
        .send(expectation[1])
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      await fakeRequest(app)
        .post('/api/todos')
        .send(expectation[2])
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      const data = await fakeRequest(app)
        .get('/api/todos')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);
        

      expect(data.body).toEqual(expectation);
    });


    //GET TEST
    test('returns a single todo item', async() => {
      const expectation = {
        
        id: 4,
        task: 'drink tea',
        completed: false,
        owner_id: 2,
        
      };
  

      await fakeRequest(app)
        .post('/api/todos')
        .send(expectation[0])
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);


      const data = await fakeRequest(app)
        .get('/api/todos/4')
        .expect('Content-Type', /json/)
        .expect(200);


  
      expect(data.body).toEqual(expectation);
    });





  });
});
