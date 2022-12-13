

function Promiser(func) {
	this.state = 'pending'
	this.func1List = []
	this.func2List = []
	this.attach = []
	func.call(this, this.resolve.bind(this), this.reject.bind(this))
}

Promiser.prototype.then = function (func1, func2) {
	const that = this
	this.func1List.push(func1) 
	this.func2List.push(func2) 
	return new Promiser(function (resolve, reject) {
		that.attach.push(this)
	})
}

Promiser.prototype.resolve = function (e) {
	this.state = 'fullfilled'
	this.currentValue = e
	if (this.attach.length > 0) {
		for ([i,pObj] of this.attach.entries()) {
			const res = this.func1List[i](e)
			pObj.resolve(res)
		}
	}
}
Promiser.prototype.reject = function (e) {
	this.state = 'failed'
	return this.func2(e)
}


const p1 = new Promiser(function (resolve, reject) {
	console.log('start....',)
	setTimeout(function () {
		resolve('setTimeOut')
	}, 3000)
})

const p2 = p1.then(function (e) {
	console.log('p2:', e)
	return 'from p2'
})
const p3 = p2.then(function (e) {
	console.log('p3', e)
	return 'from p3'
})

const p4 = p1.then(function (e) {
	console.log('p4', e)
})




