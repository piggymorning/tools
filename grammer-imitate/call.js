Function.prototype.call2 = function (context) {
	const context = context || window
	// 此处为第一个关键点，通过this拿到执行函数
	context.fn = this
	const args = []
	for (let i = 1, len = arguments.length; i < len; i++) {
		args.push('arguments[' + i + ']')
	}
	// 此处为第二个关键点，需要通过字符串参数数组的方式，把不定数参数传下去。如果进一步分析，最为关键的在于不定数参数如何传递下去
	const result = eval('context.fn(' + args + ')')
	delete context.fn
	return result
}



