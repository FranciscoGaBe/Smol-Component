/**
 * @jest-environment jsdom
 */

import parseDependencies from './parseDependencies'

test('attribute depency properly sets attribute on given element', () => {
 
	const data = {
		$elementData: {
			attributes: [ [ 'test-attribute', 'This is a {{ prop1 }}' ] ]
		},
		$element: document.createElement('div')
	}

	const state = {
		prop1: 'test'
	}

	const dependencies = parseDependencies(data)
	dependencies.prop1[0](state)

	expect(data.$element.getAttribute('test-attribute')).toBe('This is a test')
 
})

test('text node dependency properly change it\'s content', () => {
 
	const data = {
		$elementData: {
			type: 'textNode',
			content: 'This is a {{prop1 }}'
		},
		$element: document.createTextNode('test')
	}

	const state = {
		prop1: 'test'
	}

	const dependencies = parseDependencies(data)
	dependencies.prop1[0](state)

	expect(data.$element.textContent).toBe('This is a test')
 
})

test('calls updateProp property if exists', () => {
 
	const data = {
		$elementData: {
			attributes: [ [ 'testAttribute', '{{ prop1 }}' ] ]
		},
		$element: {
			$state: {
				testAttribute: null
			},
			updateProp: function (prop, value) { this.$state[prop] = value }
		}
	}

	const state = {
		prop1: true
	}

	const dependencies = parseDependencies(data)
	dependencies.prop1[0](state)

	expect(data.$element.$state.testAttribute).toBe(true)
 
})

test('parses the children properly', () => {
 
	const child = {
		$elementData: {
			attributes: [ [ 'testAttribute', '{{ prop1 }}' ] ],
		},
		$element: document.createElement('p')
	}
	const parent = {
		$elementData: {
			children: [ child ]
		},
		$element: document.createElement('div')
	}

	const state = {
		prop1: 'test',
	}

	const dependencies = parseDependencies(parent)
	dependencies.prop1[0](state)

	expect(child.$element.getAttribute('testAttribute')).toBe('test')
 
})