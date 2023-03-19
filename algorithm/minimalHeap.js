const { exchange } = require('./sortHelper')
class MinHeap {
	constructor() {
		this.count = 0
		this.data = [null]
	}
	shiftUp(k) {
		while (k > 1 && this.data[Math.floor(k / 2)].wt() > this.data[k].wt()) {
			exchange(this.data, Math.floor(k / 2), k)
			k = Math.floor(k / 2)
		}
	}
	shiftDown(k) {
		while (2 * k <= this.count) {
			let j = 2 * k
			if (j + 1 <= this.count && this.data[j].wt() > this.data[j + 1].wt()) {
				j = j + 1
			}
			if (this.data[k].wt() < this.data[j].wt()) {
				break
			}
			exchange(this.data, k, j)
			k = j
		}
	}
	insert(e) {
		// 这块有个关键点，在堆中加入新元素的时候，一定不能使用push方法直接把元素push到数组末尾。因为堆的数组结构中元素的数量，是靠count维护的
		// 而不是数组本身，在extract的时候，把末尾元素放到了首位，末尾元素并未清除，还是在数组中，只是count减了一下。如果用push的话，就不对了
		this.data[this.count + 1] = e
		this.shiftUp(this.count + 1)
		this.count++
		// this.data.push(e)
		// this.count++
		// this.shiftUp(this.count)
	}
	extractMinimum() {
		const target = this.data[1]
		this.data[1] = this.data[this.count]
		this.count--
		this.shiftDown(1)
		return target
	}
	size() {
		return this.count
	}

	isEmpty() {
		return this.count === 0
	}
}

module.exports = {
	MinHeap
}
