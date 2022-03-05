module.exports =  {
    parser:  '@typescript-eslint/parser',  
    extends:  [
      'plugin:@typescript-eslint/recommended', // 타입스크립트 추천 룰셋
    ],
    'plugins': ['@typescript-eslint'],
    root : true , 
    env : {
      node : true,
      jest : true,
    },
    parserOptions:  {
      ecmaVersion:  2018,  // 최신 문법 지원
      sourceType:  'module',  // 모듈 시스템 사용시
      ecmaFeatures:  {
          jsx:  true  // 리액트의 JSX 파싱을 위해서
      },
    },
    rules:  {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'semi-spacing': ['error', {
        'before': false,
        'after': true,
      }],
      'max-len': ['warn', { 'code': 150 }],
    },
  };