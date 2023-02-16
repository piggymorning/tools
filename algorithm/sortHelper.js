function randomArrayGenerator(n, rangeL, rangeR) {
	const arr = []
	for (let i = 0; i < n; i++) {
		let value = rangeL + Math.round(Math.random() * (rangeR - rangeL))
		arr.push(value)
	}
	return arr
}
function generateNearlyOrderedArray(n, random) {
	const array = []
	for (let i = 0; i < n; i++) {
		array.push(i)
	}
	for (let j = 0; j < random; j++) {
		const x = Math.floor(Math.random() * n)
		const y = Math.floor(Math.random() * n)
		const tempValue = array[x]
		array[x] = array[y]
		array[y] = tempValue
	}
	return array
}


function isSorted(arr) {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] > arr[i + 1]) return false
	}
	return true
}
function testSort(funcName, func, arr) {
	const startTime = (new Date()).getTime()
	const result = func(arr)
	const endTime = (new Date()).getTime()
	const consuming = (endTime - startTime) / 1000
	if (isSorted(result)) {
		console.log(`${funcName}函数执行完毕，耗时：${consuming}秒`)
	}
}
function exchange(arr,index1,index2){
	const tempValue = arr[index1]
	arr[index1] = arr[index2]
	arr[index2] = tempValue
}


module.exports = {
	randomArrayGenerator,
	generateNearlyOrderedArray,
	testSort,
	isSorted,
	exchange
}
