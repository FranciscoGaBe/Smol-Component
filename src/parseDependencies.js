const interpolationRegex = /{{\s*(.*?)\s*}}/gi

const matchInterpolation = text => [ ...text.matchAll(interpolationRegex) ]

export default dataTree => {

	const dependencies = {}

	const replaceAll = (text, state) => text.replaceAll(interpolationRegex, (_, prop) => state[prop])

	const getDependencies = ({ $elementData, $element }) => {

		if ($elementData.attributes) $elementData.attributes.forEach(([ attrName, value ]) => {

			const matches = matchInterpolation('' + value)

			matches.forEach(({ 1: prop, input }) => {

				if (attrName.slice(0,2) === 'on' && $element[attrName.toLowerCase()] !== undefined) {

					$element[attrName.toLowerCase()] = $element.getMethod(prop)
					return

				}
				if (!dependencies.hasOwnProperty(prop)) dependencies[prop] = []
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