/*
	对于数组来说array.concat()或者array.slice()都可以进行拷贝，但是这种属于浅拷贝，如果数组中还有数组或者对象的话，
	那么对于嵌套的对象和数组那一层，就只是拷贝了引用
*/

/*
	数组有个简单的深拷贝方法，就是先转成字符串，然后再转回去，抛开性能问题不说，这种拷贝方式不适用于函数
*/

// 数组或对象的深拷贝
function deepCopy(obj) {
	if (typeof obj !== 'object') return
	let newObj = obj instanceof Array ? [] : {}
	for (let i in obj) {
		newObj[i] = typeof obj[i] === 'object' ? deepCopy(obj) : obj[i]
	}
	return newObj
}

// jQuery第一版

function extend1() {
	let name, options, copy
	let length = arguments.length
	let target = arguments[0]
	let i = 1
	for (; i < length; i++) {
		options = arguments[i]
		for (name in options) {
			copy = options[name]
			if (copy !== undefined) target[name] = copy
		}
	}
	return target
}

/* jQuery 第二版主要是第一个参数变为可选择性的传入布尔值或对象，如果是布尔值且为true，则进行深度拷贝，即对象合并的时候
，会进行深度合并
*/

function extend2() {
	let deep = false
	let name, options, src, copy
	let length = arguments.length
	let i = 1
	let target = arguments[0] || {}
	if (typeof target == 'boolean') {
		deep = target
		target = arguments[i] || {}
		i++
	}
	// 如果target不是对象，那就置为对象
	if (typeof target !== 'object') {
		target = {}
	}

	for (; i < length; i++) {
		options = arguments[i]
		if (options !== null) {
			for (name in options) {
				// 先把当前值取出来
				src = target[name]
				copy = options[name]
				if (deep && typeof copy == 'object') {
					target[name] = extend(deep, src, copy)
				}
				else if (copy !== undefined) {
					target[name] = copy
				}
			}
		}
	}

	return target
}

 
