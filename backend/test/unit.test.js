const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const userController = require('../../controllers/userController');

describe('User Controller - Unit Tests', () => {
  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const req = {
        db: {
          query: sinon.stub().resolves([[
            { id: 1, firstname: 'Nada', lastname: 'Belachqer', email: 'nada@gmail.com', city: 'Temara' },
            { id: 2, firstname: 'Samia', lastname: 'Labied', email: 'samia@gmail.com', city: 'Rabat' }
          ]])
        }
      };
      
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await userController.getAllUsers(req, res);

      expect(res.json.calledOnce).to.be.true;
      expect(res.json.args[0][0]).to.have.lengthOf(2);
    });

    it('should handle database errors', async () => {
      const req = {
        db: {
          query: sinon.stub().rejects(new Error('Database error'))
        }
      };
      
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await userController.getAllUsers(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  });

  describe('createUser', () => {
    it('should create a new user with valid data', async () => {
      const req = {
        body: {
          firstname: 'Test',
          lastname: 'User',
          email: 'test@example.com',
          city: 'Test City'
        },
        db: {
          query: sinon.stub()
            .onFirstCall().resolves([{ insertId: 1 }]) // pour l'insert
        }
      };
      
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await userController.createUser(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.args[0][0]).to.have.property('id', 1);
    });

    it('should reject missing fields', async () => {
      const req = {
        body: {
          firstname: 'Test',
          // missing lastname, email, city
        },
        db: {
          query: sinon.spy()
        }
      };
      
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await userController.createUser(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(req.db.query.notCalled).to.be.true;
    });
  });
});