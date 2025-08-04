import request from 'supertest';
import { describe, expect, it } from 'vitest';

describe('auth', () => {
  describe('[POST] /auth/login', () => {
    it('should respond with 200 and a user', async ({
      integration: { app, seedData },
    }) => {
      const firstTestUser = seedData.users.teachers[0];

      const response = await request(app).post('/api/auth/login').send({
        email: firstTestUser.email,
        password: firstTestUser.password,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email', firstTestUser.email);
      expect(response.body).toHaveProperty(
        'firstName',
        firstTestUser.firstName
      );
      expect(response.body).toHaveProperty('lastName', firstTestUser.lastName);
      // expect(response.body).toHaveProperty('role', firstTestUser.role);
    });
  });
});
