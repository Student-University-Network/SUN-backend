module.exports = {
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'prettier',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'ESNext',
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint'],
	root: true,
};
