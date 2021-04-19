import { schema } from './config.schema';
import { cloneDeep } from 'lodash';

describe('Config Schema', () => {
  let processEnv;

  beforeEach(() => {
    processEnv = cloneDeep(process.env);
    process.env = {
      BASE_URL: 'http://localhost:3000',
    };
  });

  afterEach(() => {
    process.env = processEnv;
  });

  describe('BASE_URL', () => {
    it('should use default if value is not defined', () => {
      delete process.env.BASE_URL;
      expect(schema.validate(process.env).value['BASE_URL']).toEqual(
        'http://localhost:3000',
      );
    });

    it('should set value if defined', () => {
      process.env.BASE_URL = 'somerandomval';
      expect(schema.validate(process.env).value['BASE_URL']).toEqual(
        'somerandomval',
      );
    });
  });
});
