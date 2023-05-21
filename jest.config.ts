import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  // ... 다른 설정들 ...
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};

export default config;
