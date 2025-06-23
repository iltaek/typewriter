const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // next.js 앱의 경로 (next.config.js와 .env 파일이 있는 곳)
  dir: './',
})

// Jest에 전달할 커스텀 설정
const customJestConfig = {
  // 각 테스트 실행 전에 실행될 설정 파일
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // 테스트 환경 설정
  testEnvironment: 'jest-environment-jsdom',
  
  // 모듈 이름 매핑 (TypeScript path mapping)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  
  // 테스트 파일 패턴
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)',
  ],
  
  // 커버리지 설정
  collectCoverageFrom: [
    'lib/**/*.(ts|tsx)',
    'store/**/*.(ts|tsx)',
    'components/**/*.(tsx)',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  
  // 커버리지 임계값
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    'lib/': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  
  // 무시할 파일들
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
  ],
  
  // 변환 무시 패턴
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
}

// createJestConfig는 next/jest가 비동기로 Next.js 설정을 로드할 수 있도록 내보내집니다
module.exports = createJestConfig(customJestConfig)