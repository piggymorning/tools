function binarySearch(list, target) {
	let l = 0, r = list.length - 1
	// 从[l,r]中寻找target
	while (l <= r) {
		let mid = Math.floor((l + r) / 2)
		if (target === list[mid]) {
			return mid
		} else if (target < list[mid]) {
			r = mid - 1
		} else if (target > list[mid]) {
			l = mid + 1
		}
	}
	return -1
}

function binaryFloor(list,target) {
	let l = 0, r = list.length - 1
	// 从[l,r]中寻找target
	while (l <= r) {
		let mid = Math.floor((l + r) / 2)
		if (target === list[mid]) {
			let i = mid
			for (; target === list[i] && i > 0; i--) {

			}
			i++
			return i 
		} else if (target < list[mid]) {
			r = mid - 1
		} else if (target > list[mid]) {
			l = mid + 1
		}
	}
	return r
}

function binaryCeil(list,target) {
	let l = 0, r = list.length - 1
	// 从[l,r]中寻找target
	while (l <= r) {
		let mid = Math.floor((l + r) / 2)
		if (target === list[mid]) {
			let i = mid
			for (; target === list[i] && i <=r ; i++) {

			}
			i--
			return i 
		} else if (target < list[mid]) {
			r = mid - 1
		} else if (target > list[mid]) {
			l = mid + 1
		}
	}
	return l
}

console.log('res------', binaryFloor([1, 2, 3, 3, 3, 3, 8, 8, 8, 8, 10, 11, 12, 13], 7)) 
console.log('res------', binaryCeil([1, 2, 3, 3, 3, 3, 8, 8, 8, 8, 10, 11, 12, 13], 7)) 