
const { randomArrayGenerator, generateNearlyOrderedArray, testSort, isSorted, exchange } = require('./sortHelper')
// 选择排序
function chooseSort(arr) {
	for (let i = 0; i < arr.length; i++) {
		let minIndex = i
		for (let j = i + 1; j < arr.length; j++) {
			if (arr[j] < arr[minIndex]) {
				minIndex = j
			}
		}
		tempValue = arr[minIndex]
		arr[i] = tempValue
		arr[minIndex] = arr[i]
	}
	return arr
}

// 插入排序
function insertSort(arr) {
	for (let i = 1; i < arr.length; i++) {
		const tempValue = arr[i]
		let j = i
		for (; j > 0 && arr[j - 1] > tempValue; j--) {
			arr[j] = arr[j - 1]
		}
		arr[j] = tempValue
	}
	return arr
}

// 归并排序
function mergeSort(arr) {
	const newArray = arr.slice()
	function _merge(arr, l, r,) {
		const copyArr = arr.slice(l, r + 1)
		const len = copyArr.length - 1
		const mid = Math.floor(len / 2)
		let i = 0, j = mid + 1, k = l
		while (k <= r) {
			if (i > mid) {
				arr[k] = copyArr[j]
				j++
			} else if (j > len) {
				arr[k] = copyArr[i]
				i++
			} else {
				if (copyArr[i] < copyArr[j]) {
					arr[k] = copyArr[i]
					i++
				} else {
					arr[k] = copyArr[j]
					j++
				}
			}
			k++
		}
	}
	function recursion(arr, l, r) {
		// 设置边界
		if (l >= r) {
			return
		} else {
			const mid = Math.floor((l + r) / 2)
			recursion(arr, l, mid)
			recursion(arr, mid + 1, r)
			_merge(arr, l, r, mid)
		}
	}
	recursion(newArray, 0, newArray.length - 1)

	return newArray
}

function advancedMergeSort() {
	const newArray = arr.slice()
	function _merge(arr, l, r,) {
		const copyArr = arr.slice(l, r + 1)
		const len = copyArr.length - 1
		const mid = Math.floor(len / 2)
		let i = 0, j = mid + 1, k = l
		while (k <= r) {
			if (i > mid) {
				arr[k] = copyArr[j]
				j++
			} else if (j > len) {
				arr[k] = copyArr[i]
				i++
			} else {
				if (copyArr[i] < copyArr[j]) {
					arr[k] = copyArr[i]
					i++
				} else {
					arr[k] = copyArr[j]
					j++
				}
			}
			k++
		}
	}
	function recursion(arr, l, r) {
		// 设置边界
		if (l >= r) {
			return
		} else {
			const mid = Math.floor((l + r) / 2)
			recursion(arr, l, mid)
			recursion(arr, mid + 1, r)
			if (arr[mid] > arr[mid + 1]) {
				_merge(arr, l, r, mid)
			}
		}
	}
	recursion(newArray, 0, newArray.length - 1)

	return newArray
}

// js自带的原始sort排序
function originSort(arr) {
	return arr.sort(function (a, b) {
		return a - b
	})
}

// 快速排序 真牛逼！！！
function quickSort(arr) {
	function __partition(arr, l, r) {
		// 此部分代码是对在数组近乎有序的情况下，做的优化。
		// 在数组近乎有序的情况下，最小值永远在最左侧，递归的次数就会变得非常大                                                                                                                                                                             
		const index = Math.floor(Math.random() * (r - l) + l)
		exchange(arr, index, l)

		// i为当前访问的index，保证arr[l+1,j]<v   arr[j+1,i)>v
		/* 
			如何根据算法在运行过程中，维持的数组区间，计算出j、l的初始值？
			现假定现在已经运行到中间了，这个时候就可以得出数组区间
			然后在初始的时候，由于数组区间中元素个数均为0，由此再算出j、l的初始值
			为什么这个思路是可行的？
			可以这么去想，j和i的作用是什么，就是框定一个区间范围，假定运算到数组中间了，区间范围可以轻易的写出来，没有问题。
			那到了初始的时候，区间范围在正确的情况下，就必须保证区间范围内元素个数为0，这是必须的，按照这个来计算j、l值才是
			正确的。现在初始范围和中间范围都没有问题了，接下来就是保证循环逻辑没问题就可以了
		 */
		let j = l
		const target = arr[l]
		for (let i = l + 1; i <= r; i++) {
			if (arr[i] < target) {
				exchange(arr, j + 1, i)
				j++
			}
		}
		arr[l] = arr[j]
		arr[j] = target
		return j
	}
	function __quickSort(arr, l, r) {
		if (l >= r) {
			return
		}
		const p = __partition(arr, l, r)
		__quickSort(arr, l, p - 1)
		__quickSort(arr, p + 1, r)
	}
	__quickSort(arr, 0, arr.length - 1)
	return arr
}

// 三路快排，针对重复元素较多的情况
function quickSort2(arr) {
	function __quickSort2(arr, l, r) {
		if (l >= r) {
			return
		}
		// 保证arr[l+1,lt]<v arr[gt,r]>v arr[lt+1,i)=v
		const index = Math.floor(Math.random() * (r - l) + l)
		exchange(arr, index, l)
		let lt = l, gt = r + 1, i = l + 1
		while (i < gt) {
			if (arr[i] > arr[l]) {
				exchange(arr, i, gt - 1)
				gt--
			} else if (arr[i] < arr[l]) {
				exchange(arr, i, lt + 1)
				i++
				lt++
			} else i++
		}
		exchange(arr, l, lt)
		__quickSort2(arr, l, lt - 1)
		__quickSort2(arr, gt, r)
	}
	__quickSort2(arr, 0, arr.length - 1)
	return arr
}

// 求数组中逆序存在的次数 最简单的方法
function originCountReverseOrder(arr) {
	let count = 0
	for (let i = 0; i < arr.length - 1; i++) {
		for (let j = i + 1; j < arr.length; j++) {
			if (arr[j] < arr[i]) {
				count++
			}
		}
	}
	console.log('origin count is', count)
	return count
}
// 优化后的逆序存在次数算法
function countReverseOrder(arr) {
	let count = 0
	function __countOrder(arr, l, r) {
		const copyArr = arr.slice(l, r + 1)
		const len = copyArr.length - 1
		const mid = Math.floor(len / 2)
		let i = 0, j = mid + 1, k = l
		while (k <= r) {
			if (i > mid) {
				arr[k] = copyArr[j]
				j++
			} else if (j > len) {
				arr[k] = copyArr[i]
				i++
			} else {
				if (copyArr[i] <= copyArr[j]) {
					arr[k] = copyArr[i]
					i++
				} else {
					arr[k] = copyArr[j]
					j++
					count = count + (mid - i + 1)
				}
			}
			k++
		}
	}
	function __recursion(arr, l, r) {
		if (l >= r) {
			return
		}
		const mid = Math.floor((l + r) / 2)
		__recursion(arr, l, mid,)
		__recursion(arr, mid + 1, r)
		__countOrder(arr, l, r, mid)
	}
	__recursion(arr, 0, arr.length - 1)
	console.log('quick count is:', count)
	return count
}

// 获取数组中第n大的元素
function getN(arr, n) {
	let target = {};
	let N = n - 1
	function __partition(arr, l, r) {
		const index = Math.floor(Math.random() * (r - l) + l)
		exchange(arr, index, l)
		let lt = l, gt = r + 1, i = l + 1
		while (i < gt) {
			if (arr[i] > arr[l]) {
				exchange(arr, i, gt - 1)
				gt--
			} else if (arr[i] < arr[l]) {
				exchange(arr, i, lt + 1)
				i++
				lt++
			} else i++
		}
		exchange(arr, l, lt)
		return {
			less: lt - 1,
			greater: gt
		}
	}
	function recursion(arr, l, r, count) {
		if (l >= r) {
			target.a = arr[l]
			return
		}
		const obj = __partition(arr, l, r)
		if (obj.less >= count) {
			recursion(arr, l, obj.less, count)
		} else if (obj.greater <= count) {
			recursion(arr, obj.greater, r, count)
		} else {
			target.a = arr[obj.less + 1]
			return
		}
	}
	recursion(arr, 0, arr.length - 1, N)
	return target
}
// const testArray = randomArrayGenerator(100000, 1, 100)
// const testArray = generateNearlyOrderedArray(900000, 0)
// testSort('chooseSort', chooseSort, testArray.slice())
// testSort('insertSort',insertSort, testArray.slice())
// testSort('mergeSort', mergeSort, testArray.slice())
// testSort('originSort', originSort, testArray.slice())
// testSort('quickSort', quickSort, testArray.slice())
// testSort('quickSort2', quickSort2, testArray.slice())
// testSort('originCountReverseOrder', originCountReverseOrder, testArray.slice())
// testSort('countReverseOrder', countReverseOrder, testArray.slice())
console.log('1111111111111111111111', getN([1, 2, 3, 4, 5, 6, 7], 6))
// console.log('result:::',quickSort([9,6,1,5,4]))







