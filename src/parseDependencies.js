const interpolationRegex = /{{\s*(.*?)\s*}}/gi

const matchInterpolation = text => [ ...text.matchAll(interpolationRegex) ]

const styleObjectToString = style => {

	const camelToKebab = text => text.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)

	return Object.entries(style).map(([ style, value ]) => `${ camelToKebab(style) }:${ value }`).join(';')

}

export default dataTree => {

	const dependencies = {}

	const replaceAll = (text, state) => text.replaceAll(interpolationRegex, (_, prop) => state[prop])

	const getDependencies = ({ $elementData, $element }) => {

		if ($elementData.attributes) $elementData.attributes.forEach(([ attrName, value ]) => {

			const matches = matchInterpolation('' + value)

			matches.forEach(({ 1: prop, input }) => {

				const element = $element.component ? $element.component.$element : $element
				if (attrName.slice(0,2) === 'on' && element[attrName.toLowerCase()] !== undefined) {

					element[attrName.toLowerCase()] = $element.getMethod(prop)
					return

				}
				if (!dependencies.hasOwnProperty(prop)) dependencies[prop] = []

				if (attrName === 'style') {

					dependencies[prop].push(state => {

						const value = state[prop]
						if (typeof value !== 'object') $element.setAttribute(attrName, value)
						else $element.setAttribute(attrName, styleObjectToString(value))

					})

					return
				}
				
				dependencies[prop].push(
					state => $element.updateProp ? 
						$element.updateProp(attrName, state[prop]) :
						$element.setAttribute(attrName, replaceAll(input, state))
				)

			})

		})

		if ($elementData.type === 'textNode') {

			const matches = matchInterpolation($elementData.content)

			matches.forEach(({ 1: prop, input }) => {

				if (!dependencies.hasOwnProperty(prop)) dependencies[prop] = []
				dependencies[prop].push(
					state => $element.textContent = replaceAll(input, state)
				)

			})

		}

		if ($elementData.children) $elementData.children.forEach(element => getDependencies(element))

	}

	getDependencies(dataTree)

	return dependencies

}