const matchTags = template => [ ...template.matchAll(/<(.*?)>/gi) ]
const matchAttributes = tag => [ ...tag.matchAll(/([@A-Z0-9]+)(?:="(.*?)")?/gi) ]

const evaluateTag = tag => {

	const [ { 1: type }, ...attributes ] = matchAttributes(tag)

	return {
		type,
		attributes: attributes.map(({ 1: name, 2: value }) => [ name, value === undefined ? true : value ]),
		children: []
	}

}

const textNode = text => ({ type: 'textNode', content: text.replaceAll(/[\t\n]+/g, ' ').replaceAll(/\s+/g, ' ') })

const isSelfClosingTag = tag =>
	[ 'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr' ]
		.includes(tag)

export default template => {

	const matches = matchTags(template)
	const elements = []
	let root = null

	const getTextNode = (match, lastMatch = null) => {

		if (!lastMatch) return null

		const lastMatchEnd = lastMatch.index + lastMatch[0].length
		if (match.index - lastMatchEnd < 1) return null

		const text = match.input.slice(lastMatchEnd, match.index)
		if (!text.trim()) return null

		return textNode(text)

	}

	matches.forEach((match, index, matches) => {

		const closingTab = match[1][0] === '/'
		const element = closingTab ? elements.pop() : evaluateTag(match[0])
		const selfClosingTab = (match[1].slice(-1) === '/') || isSelfClosingTag(element.type)
		const parentElement = elements.slice(-1)[0]
		const textElement = getTextNode(match, matches[index - 1])

		if (textElement) (selfClosingTab ? parentElement : element).children.push(textElement)

		if (closingTab && elements.length < 1) return root = element
		if (closingTab || selfClosingTab) parentElement.children.push(element)
		else elements.push(element)

	})

	return root

}

