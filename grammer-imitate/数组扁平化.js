/* 此处用的方法，关键点在于concat方法既可以接收数组参数，也可以接收普通数值参数，这样连续地对同一个数组执行concat方法，
就相当于是在对数组进行扁平化处理
*/
function flatten(arr) {
	while (arr.some(e => Array.isArray(e))) {
		arr = [].concat(...arr)
	}
	return arr
}

// underscore版 

function flatten(input, shallow, strict, output) {
	output = output || []
	// 对数组进行这种类似的合并操作，和对象是不同的，对象可以拿key值来赋值，但是数组的话，需要用到index，因此在程序中要做到对index进行记录
	let idx = output.length
	for (let i = 0, len = input.length; i < len; i++) {
		let value = input[i]
		if (Array.isArray(value)) {
			if (shallow) {
				let j = 0, length = value.length
				// 这种在给数组赋值时，直接使用++的方式很方便。最终的效果是先执行赋值操作，然后再给变量加1
				while (j < length) output[idx++] = value[j++]
			}
			else {
				flatten(value, shallow, strict, output)
				idx = output.length
			}
		}
		else if (!strict) {
			output[idx++] = value
		}
	}
	return output
}

