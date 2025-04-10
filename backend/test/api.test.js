import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import mysql from 'mysql2/promise';
import app from '../../app.js'; // Notez l'extension .js explicite

chai.use(chaiHttp);
const { expect } = chai;

describe('API Integration Tests', () => {
  let poolStub;

  before(() => {
    poolStub = sinon.stub(mysql, 'createPool');
  });

  after(() => {
    poolStub.restore();
  });

  beforeEach(() => {
    poolStub.reset();
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: 1, firstname: 'Nada', lastname: 'Belachqer', email: 'nada@gmail.com', city: 'Temara' }
      ];
      
      poolStub.returns({
        getConnection: () => Promise.resolve({
          query: () => Promise.resolve([mockUsers]),
          release: () => {}
        }),
        query: () => Promise.resolve([mockUsers])
      });

      const res = await chai.request(app).get('/api/users');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body[0]).to.have.property('firstname', 'Nada'); // Corrigé pour correspondre au mock
    });

    it('should handle database errors', async () => {
      poolStub.returns({
        getConnection: () => Promise.resolve({
          query: () => Promise.reject(new Error('Database error')),
          release: () => {}
        })
      });

      const res = await chai.request(app).get('/api/users');

      expect(res).to.have.status(500);
      expect(res.body).to.have.property('error');
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const newUser = {
        firstname: 'New',
        lastname: 'User',
        email: 'new@example.com',
        city: 'Lyon'
      };

      poolStub.returns({
        getConnection: () => Promise.resolve({
          query: (sql, params) => {
            if (sql.startsWith('INSERT')) {
              return Promise.resolve([{ insertId: 2 }]);
            }
            return Promise.resolve([[{ ...newUser, id: 2 }]]);
          },
          release: () => {}
        })
      });

      const res = await chai.request(app)
        .post('/api/users')
        .send(newUser);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('id', 2);
    });

    it('should reject invalid data', async () => {
      const invalidUser = {
        firstname: 'Invalid' // missing other fields
      };

      const res = await chai.request(app)
        .post('/api/users')
        .send(invalidUser);

      expect(res).to.have.status(400);
    });
  });
});