const { randomArrayGenerator, exchange } = require('./sortHelper')


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

function heapSort(list) {
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

function heapSort2(arr){
	const res = []
	const heap = new maxHeap()
	heap.from(arr)
	while (!heap.isEmpty()) {
		res.push(heap.extractMax())
	}
	return res
}
console.log('1111111111111111111111',heapSort2(list))





