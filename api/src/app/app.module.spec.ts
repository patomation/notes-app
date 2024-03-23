import { AppModule } from './app.module';

describe('AppModule', () => {
  it('can init new module without breaking', () => {
    const module = new AppModule();
    expect(module).toBeDefined();
  });
});
