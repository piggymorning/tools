const { randomArrayGenerator, exchange } = require('./sortHelper')
/* 
	对于堆这种数据结构，特别是最大堆，如果把它放到数组中，因为这种结构本身的特点，数组中的元素之间会有
	一定的运算规律，借助这种运算规律，我们能够快速地实现我们的需求。简单对这些规律做下总结：
	1、堆有两个主要的行为，一个是添加新的元素，一个是取出最大的元素。对于添加新元素来说，新元素最初会处于
	数组末尾的位置，接下来就是想办法让它往上走，借助索引之间的关系，就不断地对索引值除与2，然后判断大小就可以了
	2、最大元素位于根节点的位置，取出最大元素以后，拿数组末尾元素填充根节点，之后需要把根节点放到合适的位置，
	那还是借助索引值规律，不断地乘2，判断大小，直到找到合适的位置为止
	3、还有一个重要行为，即把一个普通数组转化为堆结构。这需要先找到堆中的第一个非叶子节点，然后调整位置（这个位置调整是把当前节点当做主节点来判断），
	然后索引值逐渐减一，直到排到根节点为止
 */

class maxHeap {
	constructor() {
		this.count = 0
		this.data = []
	}

	shiftUp(k) {
		while (k > 1 && this.data[Math.floor(k / 2)] < this.data[k]) {
			exchange(this.data, Math.floor(k / 2), k)
			k = Math.floor(k / 2)
		}
	}

	shiftDown(k) {
		while (2 * k <= this.count) {
			let j = 2 * k
			if (j + 1 <= this.count && this.data[j + 1] > this.data[j]) j = j + 1
			// 这一步非常重要，如果发现当前父节点大于任何子节点，就可以把循环停止了
			if (this.data[k] > this.data[j]) {
				break
			}
			exchange(this.data, k, j)
			k = j
		}
	}

	insert(item) {
		let k = this.count + 1
		this.data[k] = item
		this.shiftUp(k)
		this.count++
	}

	extractMax() {
		const result = this.data[1]
		this.data[1] = this.data[this.count]
		this.count--
		this.shiftDown(1)
		return result
	}

	size() {
		return this.count
	}

	isEmpty() {
		return this.count === 0
	}

	from(arr) {
		for (let i = 0; i < arr.length; i++) {
			this.data[this.count + 1] = arr[i]
			this.count++
		}
		for (let k = Math.floor(this.count / 2); k >= 1; k--) {
			this.shiftDown(k)
		}
	}
}


const list = randomArrayGenerator(15, 1, 15)

function heapSort1(list) {
	const heap1 = new maxHeap()
	let res = []
	for (let i = 0; i < list.length; i++) {
		heap1.insert(list[i])
	}
	while (!heap1.isEmpty()) {
		res.push(heap1.extractMax())
	}
	return res
}

function heapSort2(arr) {
	const res = []
	const heap = new maxHeap()
	heap.from(arr)
	while (!heap.isEmpty()) {
		res.push(heap.extractMax())
	}
	return res
}

// 真正的堆排序方法,在原数组的基础上直接进行堆排序，而不是借用堆构造函数去排序
function heapSort(arr) {
	function __shiftDown(arr, n, k) {
		let i = k;
		while (2 * i + 1 <= n) {
			let j = k * 2 + 1
			if (arr[j] < arr[j + 1] && j + 1 <= n) j = j + 1
			if (arr[i] > arr[j]) {
				break
			}
			exchange(arr,i,j)
			i = j
		}
	}
	let len = arr.length
	for (let i = Math.floor((len - 2) / 2); i >= 0; i--) {
		__shiftDown(arr, len, i)
	}
	for (let j =len - 1 ; j >= 0; j--) {
		exchange(arr, 0, j)
		__shiftDown(arr, j-1, 0)
	}
	return arr
}




