/**
 * @jest-environment jsdom
 */

import templateParser from './templateParser'

test('turns template into a tree of elements and children', () => {

	const template = `
	<div show>
		<h2>{{ title }}</h2>
		<input type="{{ inputType }}">
		<div>
			This is a 
			<Component staticProp="test" dynamicProp="{{ componentProp }}" />
			{{ test }}
		</div>
	</div>
	`

	const expected = expect.objectContaining({
		type: 'div',
		attributes: [ [ 'show', true ] ],
		children: [
			expect.objectContaining({
				type: 'h2',
				attributes: [],
				children: [ { type: 'textNode', content: '{{ title }}' } ],
			}),
			expect.objectContaining({
				type: 'input',
				attributes: [ [ 'type', '{{ inputType }}' ] ],
				children: [],
			}),
			expect.objectContaining({
				type: 'div',
				attributes: [],
				children: [
					expect.objectContaining({ type: 'textNode', content: ' This is a ' }),
					expect.objectContaining({
						type: 'Component',
						attributes: [ [ 'staticProp', 'test' ], [ 'dynamicProp', '{{ componentProp }}' ] ],
						children: [],
					}),
					expect.objectContaining({ type: 'textNode', content: ' {{ test }} ' })
				]
			})
		]
	})

	expect(templateParser(template)).toEqual(expected)

})

test('parses a text of 1 character inside a one line element', () => {

	const template = `
		<div>A</div>
	`

	const expected = expect.objectContaining({
		type: 'div',
		children: [ expect.objectContaining({ type: 'textNode', content: 'A' }) ]
	})

	expect(templateParser(template)).toEqual(expected)

})