const { UF1,UF2,UF3,} = require('./union-find')
function testUF1(n) {
	const startTime = (new Date()).getTime()
	const instance = new UF1(n)
	for (let i = 0; i < n; i++) {
		const a = Math.floor(Math.random() * n)
		const b = Math.floor(Math.random() * n)
		instance.unionElements(a,b)
	}
	for (let i = 0; i < n; i++) {
		const a = Math.floor(Math.random() * n)
		const b = Math.floor(Math.random() * n)
		instance.isConnected(a,b)
	}
	const endTime = (new Date()).getTime()
	const consuming = (endTime - startTime) / 1000
	console.log(`UF1执行完毕，耗时：${consuming}秒`)
}
function testUF2(n) {
	const startTime = (new Date()).getTime()
	const instance = new UF2(n)
	for (let i = 0; i < n; i++) {
		const a = Math.floor(Math.random() * n)
		const b = Math.floor(Math.random() * n)
		instance.unionElements(a,b)
	}
	for (let i = 0; i < n; i++) {
		const a = Math.floor(Math.random() * n)
		const b = Math.floor(Math.random() * n)
		instance.isConnected(a,b)
	}
	const endTime = (new Date()).getTime()
	const consuming = (endTime - startTime) / 1000
	console.log(`UF2执行完毕，耗时：${consuming}秒`)
}
function testUF3(n) {
	const startTime = (new Date()).getTime()
	const instance = new UF3(n)
	for (let i = 0; i < n; i++) {
		const a = Math.floor(Math.random() * n)
		const b = Math.floor(Math.random() * n)
		instance.unionElements(a,b)
	}
	for (let i = 0; i < n; i++) {
		const a = Math.floor(Math.random() * n)
		const b = Math.floor(Math.random() * n)
		instance.isConnected(a,b)
	}
	const endTime = (new Date()).getTime()
	const consuming = (endTime - startTime) / 1000
	console.log(`UF2执行完毕，耗时：${consuming}秒`)
}

const testData = 100000
testUF1(testData)
testUF2(testData)
testUF3(testData)