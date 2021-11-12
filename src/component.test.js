/**
 * @jest-environment jsdom
 */

import Component from './component'

test('mounts component into given parent', () => {

	const component = Component({
		name: 'test-component',
		template: '<div></div>'
	})(true)

	component.$mount(document.body)

	expect(document.body.querySelector('[data-sc-name="test-component"]')).toEqual(expect.anything())

	document.body.removeChild(component.$element)

})

test('updates interpolated state', () => {

	const component = Component({
		template: '<div>{{ test }}</div>',
		state: {
			test: 'test'
		}
	})(true)

	component.$mount(document.body)

	component.test = 50

	expect(component.$element.innerHTML).toBe('50')

	document.body.removeChild(component.$element)

})

test('mounts child component', () => {

	const child = Component({
		name: 'child',
		template: '<div></div>'
	})

	const parent = Component({
		name: 'parent',
		template: `
		<div>
			<Child />
		</div>
		`,
		components: { Child: child }
	})(true)

	parent.$mount(document.body)

	expect(document.body.querySelector('[data-sc-name="parent"]>[data-sc-name="child"]')).toEqual(expect.anything())

	document.body.removeChild(parent.$element)

})

test('updates interpolated attributes', () => {

	const component = Component({
		template: '<div test="{{ testState }}"></div>',
		state: {
			testState: true
		}
	})(true)

	component.$mount(document.body)

	component.testState = 'works'

	expect(component.$element.getAttribute('test')).toEqual('works')

	document.body.removeChild(component.$element)

})

test('methods get asigned to the component and have access to "this"', () => {

	const component = Component({
		template: '<div></div>',
		state: {
			counter: 0
		},
		methods: {
			increase: function () { this.counter++ }
		}
	})(true)

	component.$mount(document.body)

	component.increase()

	expect(component.counter).toEqual(1)

	document.body.removeChild(component.$element)

})

test('watch get asigned to the component and recieves new and old value', () => {

	const component = Component({
		template: '<div></div>',
		state: {
			counter: 0
		},
		watch: {
			counter: function (newValue, oldValue) {

				expect(newValue).toEqual(1)
				expect(oldValue).toEqual(0)

			}
		}
	})(true)

	expect.assertions(2)
	component.$mount(document.body)

	component.counter++

	document.body.removeChild(component.$element)

})

test('props get passed down by parent component and updates correctly', () => {

	const child = Component({
		name: 'child',
		template: '<div>{{ counter }}</div>',
		props: [ 'counter' ]
	})

	const parent = Component({
		name: 'parent',
		template: `
		<div>
			<Child counter="{{ counter }}" />
		</div>
		`,
		components: { Child: child },
		state: {
			counter: 0
		}
	})(true)

	parent.$mount(document.body)
	const childElement = parent.$element.querySelector('[data-sc-name="child"]')

	expect.assertions(2)
	expect(childElement.innerHTML).toEqual('0')
	parent.counter += 5
	expect(childElement.innerHTML).toEqual('5')

	document.body.removeChild(parent.$element)

})

test('onMounted gets called after mounting the component', () => {

	const component = Component({
		template: '<div></div>',
		onMounted: function () {

			expect(true).toBe(true)

		}
	})(true)

	expect.assertions(1)
	component.$mount(document.body)
	document.body.removeChild(component.$element)

})

test('globalState is can be accessed by any component and updates correctly', () => {

	const child = Component({
		name: 'child',
		template: '<div>{{ globalCounter }}</div>',
		globalState: [ 'globalCounter' ],
		globalWatch: {
			globalCounter: function (newValue, oldValue) {

				expect(newValue).toBe(55)
				expect(oldValue).toBe(undefined)

			}
		}
	})

	const parent = Component({
		name: 'parent',
		template: `
		<div>
			<Child />
		</div>
		`,
		components: { Child: child },
		globalState: [ 'globalCounter' ],
		onMounted: function () {
			
			expect(this.globalCounter).toBe(undefined)
			this.globalCounter = 55
			expect(this.globalCounter).toBe(55)

		}
	})(true)

	expect.assertions(5)
	parent.$mount(document.body)
	const childElement = parent.$element.querySelector('[data-sc-name="child"]')

	expect(childElement.innerHTML).toBe('55')

	document.body.removeChild(parent.$element)

})