import templateParser from './templateParser.js'
import parseDependencies from './parseDependencies.js'

const mergeOptions = options => Object.assign({}, {
	name: '',
	template: '',
	components: [],
	props: [],
	state: {},
	watch: {},
	methods: {},
	globalState: [],
	globalWatch: {},
	onMounted: () => {}
}, options)

const createElements = (comp, dataTree) => {

	const data = {
		$elementData: {
			...dataTree,
			children: (dataTree.children || []).map(child => createElements(comp, child))
		},
		$element: null
	}

	if (dataTree.type === 'textNode') data.$element = document.createTextNode(dataTree.content)
	else if (!comp.$components[dataTree.type]) {

		data.$element = document.createElement(dataTree.type)
		dataTree.attributes.forEach(([ name, value ]) => {

			if (name.slice(0,2) === 'on' && data.$element[name.toLowerCase()] !== undefined) return
			data.$element.setAttribute(name, value)

		})

	}
	else {

		const childComponent = comp.$components[dataTree.type]()

		data.$element = {
			component: childComponent,
			updateProp: childComponent.$updateProp
		}

	}

	data.$element.getMethod = name => () => comp[name]()

	return data

}

const prepareRoot = component => {

	component.$root = component
	component.$global = {
		$state: {},
		$watch: {}
	}

}

const prepareChild = (component, parent) => {

	component.$parent = parent
	component.$root = parent.$root

}

const setGlobalState = component => {

	const global = component.$root.$global

	component.$options.globalState.forEach(prop => {

		if (!global.$state.hasOwnProperty(prop)) {

			global.$state[prop] = undefined

			Object.defineProperty(global, prop, {
				set: value => {

					const oldValue = global.$state[prop]
					global.$state[prop] = value
					if (global.$watch[prop]) global.$watch[prop].forEach(callback => callback(value, oldValue))

				},
				get: () => global.$state[prop]
			})

		}

		Object.defineProperty(component, prop, {
			set: value => global[prop] = value,
			get: () => global[prop]
		})

		if (!global.$watch[prop]) global.$watch[prop] = []
		global.$watch[prop].push(() => {

			if (!component.$dependencies[prop]) return
			component.$dependencies[prop].forEach(callback => callback(global.$state))

		})

	})

	return component

}

const setGlobalWatch = component => {

	const global = component.$root.$global

	Object.entries(component.$options.globalWatch).forEach(([ prop, callback ]) => {

		if (!global.$watch[prop]) global.$watch[prop] = []
		global.$watch[prop].push(callback.bind(component))

	})

	return component

}

const setGlobals = component => setGlobalWatch(setGlobalState(component))

const mountElements = (dataTree, parent, mount) => {

	dataTree.$elementData.children.forEach(child => {

		mountElements(child, dataTree.$element, mount)

	})

	if (dataTree.$element.component) mount(dataTree.$element.component)
	else parent.appendChild(dataTree.$element)

}

const mountComponent = component => (parent) => {

	if (parent.$element) prepareChild(component, parent)
	mountElements(component.$dataTree, parent.$element || parent, child => child.$mount(component))
	setGlobals(component)
	component.$forceUpdate()
	component.$element.setAttribute('data-sc-name', component.$name)
	if (parent.$element) parent.$element.appendChild(component.$element)
	else parent.appendChild(component.$element)
	component.$options.onMounted.bind(component)()

}

const changeState = (component, prop) => value => {

	const oldValue = component.$state[prop]
	component.$state[prop] = value
	if (component.$dependencies[prop]) component.$dependencies[prop].forEach(callback => callback(component.$state))
	if (component.$watch[prop]) component.$watch[prop](value, oldValue)

}

const setState = component => {

	component.$options.props.forEach(prop => {

		Object.defineProperty(component, prop, {
			get: () => component.$state[prop]
		})

	})

	Object.entries(component.$options.state).forEach(([ prop, value ]) => {

		if (component.$options.props.includes(prop))
			return console.error(`State ${ prop } has already been declared as a prop for component ${ component.$name }`)

		component.$state[prop] = value

		Object.defineProperty(component, prop, {
			set: changeState(component, prop),
			get: () => component.$state[prop]
		})

	})
	return component

}

const forceUpdate = component => () => {

	Object.values(component.$dependencies).forEach(arr => arr.forEach(callback => callback(component.$state)))

}

const setMethods = component => {

	Object.entries(component.$options.methods).forEach(([ name, method ]) => component[name] = method)
	return component

}

const setWatchs = component => {

	Object.entries(component.$options.watch).forEach(([ prop, callback ]) => component.$watch[prop] = callback.bind(component))
	return component

}

const prepareComponent = comp => setWatchs(setMethods(setState(comp)))

const updateProp = component => (prop, value) => {

	if (!component.$options.props.includes(prop)) return
	changeState(component, prop)(value)

}

export default options => (root = false) => {

	const myOptions = mergeOptions(options)

	const component = {
		$options: myOptions,
		$components: myOptions.components,
		$name: myOptions.name,

		$parent: null,
		$root: null,
		$element: null,

		$dataTree: {
			$element: null
		},
		
		$dependencies: {},
		$state: {},
		$watch: {},
		$global: {},

		$mount: () => {},

		$forceUpdate: () => {},
		$updateProp: () => {}
	}

	if (root) prepareRoot(component)

	prepareComponent(component)

	component.$dataTree = createElements(component, templateParser(myOptions.template))
	component.$dependencies = parseDependencies(component.$dataTree)
	component.$element = component.$dataTree.$element
	component.$mount = mountComponent(component)
	component.$forceUpdate = forceUpdate(component)
	component.$updateProp = updateProp(component)

	return component

}