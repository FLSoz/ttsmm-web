module.exports = {
	plugins: ['import', 'react'],
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:jest/recommended',
		'plugin:promise/recommended',
		'plugin:compat/recommended',
		'plugin:prettier/recommended'
	],
	rules: {
		'prettier/prettier': [
			'error',
			{
				singleQuote: true,
				trailingComma: 'none',
				tabWidth: 2,
				useTabs: true,
				printWidth: 140,
				bracketSameLine: false,
				endOfLine: 'auto'
			}
		],
		'no-restricted-imports': [
			'error',
			{
				patterns: ['@mui/*/*/*', '!@mui/material/test-utils/*']
			}
		],
		'comma-dangle': ['error', 'never'],
		'max-len': [
			'warn',
			{
				code: 180,
				ignoreComments: true,
				ignoreUrls: true,
				ignoreTrailingComments: true
			}
		],
		'react/no-unused-state': 'warn',
		'react/destructuring-assignment': 'warn',
		'react/no-access-state-in-setstate': 'warn',
		'react/no-direct-mutation-state': 'warn',
		'react/jsx-props-no-spreading': 'off',
		'promise/always-return': 'warn',
		'promise/catch-or-return': ['warn', { terminationMethod: ['catch', 'asCallback', 'finally'] }],
		'@typescript-eslint/no-explicit-any': 'warn',
		'no-console': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'class-methods-use-this': 'warn',
		'prefer-destructuring': 'warn',
		'react/require-default-props': 'off'
	},
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		project: '../tsconfig.json',
		tsconfigRootDir: 'src',
		createDefaultProgram: true
	},
	settings: {
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx']
		}
	}
};
