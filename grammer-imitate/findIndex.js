function findIndex1(array, predicate, context) {
	for (let i = 0; i < array.length; i++) {
		if (predicate.call(context, array[i], i, array)) return i
	}
	return -1
}

// 返回函数，同时支持正序查询和倒叙查询。巧妙之处在于通过参数1或者-1来决定产生正序和倒序函数，参数本身又可以用在循环的判定上
function createFindIndex(dir) {
	return function (array, predicate, context) {
		let length = array.length
		let index = dir > 0 ? 0 : length - 1
		for (; index >= 0 && index < length; index += dir) {
			if (predicate.call(context, array[index], index, array)) return index
		}
		return -1
	}
}

let findIndex = createFindIndex(1)
let findLastIndex = createFindIndex(-1)

// 二分法：返回index，保证obj插入到index的位置数组依然有序
function sortIndex(array, obj) {
	
	let low = 0, high = array.length
	let mid = Math.floor((low + high) / 2)
	while (low < high) {
		if (array[mid] < obj) low = mid + 1
		else high = mid
	}
	return high
}