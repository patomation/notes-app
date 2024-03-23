import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

interface TestCase {
  name: string;
  authorization?: string;
  verifyAsync?: () => void;
  expectedError?: UnauthorizedException;
}

describe('auth.guard', () => {
  describe('canActivate', () => {
    const testCases: TestCase[] = [
      {
        name: 'throws UnauthorizedException missing token',
        authorization: undefined,
        expectedError: new UnauthorizedException('missing token'),
      },
      {
        name: 'mock token is fine',
        authorization: 'Bearer MOCK_TOKEN',
      },
      {
        name: 'mock token throws mock error',
        authorization: 'Bearer MOCK_TOKEN',
        verifyAsync: () => {
          throw new Error();
        },
        expectedError: new UnauthorizedException(),
      },
    ];

    testCases.forEach(({ name, authorization, expectedError, verifyAsync }) => {
      it(name, async () => {
        class JwtServiceMock extends JwtService {
          sign = jest.fn();
          signAsync = jest.fn();
          verify = jest.fn();
          verifyAsync = jest.fn(
            async (): Promise<any> =>
              verifyAsync
                ? verifyAsync()
                : {
                    sub: '',
                    username: '',
                  },
          );
          decode = jest.fn();
        }
        const context: ExecutionContext = {
          getClass: jest.fn(),
          getHandler: jest.fn(),
          getArgs: jest.fn(),
          getArgByIndex: jest.fn(),
          switchToRpc: jest.fn(),
          switchToHttp: jest.fn(() => ({
            getRequest: jest.fn(() => ({
              player: undefined,
              headers: {
                authorization,
              },
            })) as any,
            getResponse: jest.fn(),
            getNext: jest.fn(),
          })),
          switchToWs: jest.fn(),
          getType: jest.fn(),
        };

        try {
          const jwtService: JwtService = new JwtServiceMock();
          const authGuard = new AuthGuard(jwtService);
          const actual = await authGuard.canActivate(context);
        } catch (error) {
          expect(error).toEqual(expectedError);
        }
      });
    });

    it('passes', () => {
      class JwtServiceMock extends JwtService {
        constructor() {
          super();
          this.sign = jest.fn();
          this.signAsync = jest.fn();
          this.verify = jest.fn();
          this.verifyAsync = jest.fn(
            async (): Promise<any> => ({
              sub: '',
              username: '',
            }),
          );
          this.decode = jest.fn();
        }
      }
      const context: ExecutionContext = {
        getClass: jest.fn(),
        getHandler: jest.fn(),
        getArgs: jest.fn(),
        getArgByIndex: jest.fn(),
        switchToRpc: jest.fn(),
        switchToHttp: jest.fn(() => ({
          getRequest: jest.fn(() => ({
            player: undefined,
            headers: {
              authorization: 'Bearer TOKEN',
            },
          })) as any,
          getResponse: jest.fn(),
          getNext: jest.fn(),
        })),
        switchToWs: jest.fn(),
        getType: jest.fn(),
      };

      const jwtService: JwtService = new JwtServiceMock();
      const authGuard = new AuthGuard(jwtService);
      const actual = authGuard.canActivate(context);
    });
  });
});
