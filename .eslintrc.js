module.exports = {
	env: {
		browser: true,
		es2021: true
	},
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: 12,
		sourceType: 'module'
	},
	rules: {
		semi: [ 'error', 'never' ],
		indent: [ 'error', 'tab' ],
		'object-curly-spacing': [ 'error', 'always' ],
		'array-bracket-spacing': [ 'error', 'always' ],
		quotes: [ 'error', 'single' ]
	}
}
