import { AuthModule } from './auth.module';

describe('auth.module', () => {
  it('no errors', () => {
    const authModule = new AuthModule();
    expect(authModule).toBeDefined();
  });
});
