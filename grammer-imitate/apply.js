Function.prototype.apply2 = function (f) {
	const context = f || window
	context.fn = this

	const originArgs = arguments[1] || []
	let argus = []
	for (let i = 0; i < originArgs.length; i++) {
		argus.push(`originArgs[${i}]`)
	}
	const result = eval(`context.fn(${argus})`)
	delete context.fn
	return result
}


