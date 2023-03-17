function getChildren(board) {
	const result = []
	let zeroArrayIndex;
	let zeroIndex;
	board.forEach((e, i) => {
		const res = e.indexOf(0)
		if (res !== -1) {
			zeroArrayIndex = i
			zeroIndex = res
		}
	})
	const otherArrayIndex = zeroArrayIndex === 0 ? 1 : 0
	const boardtemp1 = JSON.parse(JSON.stringify({ data: board })).data
	boardtemp1[zeroArrayIndex][zeroIndex] = boardtemp1[otherArrayIndex][zeroIndex]
	boardtemp1[otherArrayIndex][zeroIndex] = 0
	result.push(boardtemp1)
	if (zeroIndex !== 0) {
		const boardtemp2 = JSON.parse(JSON.stringify({ data: board })).data
		boardtemp2[zeroArrayIndex][zeroIndex] = boardtemp2[zeroArrayIndex][zeroIndex - 1]
		boardtemp2[zeroArrayIndex][zeroIndex - 1] = 0
		result.push(boardtemp2)
	}
	if (zeroIndex !== 2) {
		const boardtemp3 = JSON.parse(JSON.stringify({ data: board })).data
		boardtemp3[zeroArrayIndex][zeroIndex] = boardtemp3[zeroArrayIndex][zeroIndex + 1]
		boardtemp3[zeroArrayIndex][zeroIndex + 1] = 0
		result.push(boardtemp3)
	}
	return result
}
function slidingPuzzle(board) {
	const dest = [[1, 2, 3], [4, 5, 0]]
	if(`${board[0]}-${board[1]}` === `${dest[0]}-${dest[1]}`){
		return 0
	}
	const ord = {}
	const initial = board
	const q = []
	q.push(initial)
	ord[`${initial[0]}-${initial[1]}`] = 0
	let isFind = false
	let res
	while (q.length > 0 && !isFind) {
		const target = q.shift()
		const children = getChildren(target)
		children.forEach(e => {
			if (!ord[`${e[0]}-${e[1]}`] && !isFind) {
				q.push(e)
				ord[`${e[0]}-${e[1]}`] = ord[`${target[0]}-${target[1]}`] + 1
				if (`${e[0]}-${e[1]}` === `${dest[0]}-${dest[1]}`) {
					isFind = true
					res = ord[`${e[0]}-${e[1]}`]
				}
			}
		})
	}
	return isFind ? res : -1

}

console.log('1', slidingPuzzle([[4, 1, 2], [5, 0, 3]]))
console.log('2', slidingPuzzle([[1,2,3],[5,4,0]]))
console.log('3', slidingPuzzle([[1,2,3],[4,0,5]]))
