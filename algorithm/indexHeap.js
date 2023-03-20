// 最大索引堆
class MaxIndexHeap{
	constructor() {
		this.count = 0
		this.data = []
		this.indexes = []
		this.reverses = []
	}

	#shiftUp(k) {
		while (k > 1 && this.data[this.indexes[Math.floor(k / 2)]] < this.data[this.indexes[k]]) {
			exchange(this.indexes, Math.floor(k / 2), k)
			this.reverses[this.indexes[k]] = k
			this.reverses[this.indexes[Math.floor(k/2)]] = Math.floor(k/2)
			k = Math.floor(k / 2)
		}
	}

	#shiftDown(k) {
		while (2 * k <= this.count) {
			let j = 2 * k
			if (j + 1 <= this.count && this.data[this.indexes[j + 1]] > this.data[this.indexes[j]]) j = j + 1
			// 这一步非常重要，如果发现当前父节点大于任何子节点，就可以把循环停止了
			if (this.data[this.indexes[k]] > this.data[this.indexes[j]]) {
				break
			}
			exchange(this.indexes, k, j)
			this.reverses[this.indexes[k]] = k
			this.reverses[this.indexes[j]] = j
			k = j
		}
	}

	insert(item,k) {
		let i = k+1
		this.data[i] = item
		this.indexes[this.count+1] = i
		this.reverses[i] = this.count +1
		this.#shiftUp(this.count+1)
		this.count++
	}

	extractMax() {
		const result = this.data[this.indexes[1]]
		this.indexes[1] = this.indexes[this.count]
		this.reverses[this.indexes[1]] = 1
		this.reverses[this.indexes[this.count]] = 0
		this.count--
		this.#shiftDown(1)
		return result
	}

	extractMaxIndex(){
		let ret = this.indexes[1] -1
		this.indexes[1] = this.indexes[this.count]
		this.reverses[this.indexes[this.count]] = 0
		this.count--
		this.#shiftDown(1)
		return ret
	}

	getItem(i){
		let i = i+1
		return this.data[i]
	}

	change(i,item){
		this.data[i+1] = item
		// for(let j=1;j<=this.count;j++){
		// 	if(this.indexes[j] = i+1){
		// 		this.#shiftDown(j)
		// 		this.#shiftUp(j)
		// 		return
		// 	}
		// }
		let j = this.reverses[i+1]
		this.#shiftDown(j)
		this.#shiftUp(j)
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
			this.#shiftDown(k)
		}
	}
}
class MinIndexHeap{
	constructor() {
		this.count = 0
		this.data = []
		this.indexes = []
		this.reverses = []
	}

	#shiftUp(k) {
		while (k > 1 && this.data[this.indexes[Math.floor(k / 2)]] < this.data[this.indexes[k]]) {
			exchange(this.indexes, Math.floor(k / 2), k)
			this.reverses[this.indexes[k]] = k
			this.reverses[this.indexes[Math.floor(k/2)]] = Math.floor(k/2)
			k = Math.floor(k / 2)
		}
	}

	#shiftDown(k) {
		while (2 * k <= this.count) {
			let j = 2 * k
			if (j + 1 <= this.count && this.data[this.indexes[j + 1]] > this.data[this.indexes[j]]) j = j + 1
			// 这一步非常重要，如果发现当前父节点大于任何子节点，就可以把循环停止了
			if (this.data[this.indexes[k]] > this.data[this.indexes[j]]) {
				break
			}
			exchange(this.indexes, k, j)
			this.reverses[this.indexes[k]] = k
			this.reverses[this.indexes[j]] = j
			k = j
		}
	}

	insert(item,k) {
		let i = k+1
		this.data[i] = item
		this.indexes[this.count+1] = i
		this.reverses[i] = this.count +1
		this.#shiftUp(this.count+1)
		this.count++
	}

	extractMin() {
		const result = this.data[this.indexes[1]]
		this.indexes[1] = this.indexes[this.count]
		this.reverses[this.indexes[1]] = 1
		this.reverses[this.indexes[this.count]] = 0
		this.count--
		this.#shiftDown(1)
		return result
	}

	extractMinIndex(){
		let ret = this.indexes[1] -1
		this.indexes[1] = this.indexes[this.count]
		this.reverses[this.indexes[this.count]] = 0
		this.count--
		this.#shiftDown(1)
		return ret
	}

	getItem(i){
		let i = i+1
		return this.data[i]
	}

	change(i,item){
		this.data[i+1] = item
		// for(let j=1;j<=this.count;j++){
		// 	if(this.indexes[j] = i+1){
		// 		this.#shiftDown(j)
		// 		this.#shiftUp(j)
		// 		return
		// 	}
		// }
		let j = this.reverses[i+1]
		this.#shiftDown(j)
		this.#shiftUp(j)
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
			this.#shiftDown(k)
		}
	}
}

module.exports = {
	MaxIndexHeap,MinIndexHeap
}