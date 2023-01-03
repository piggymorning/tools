/* 
	这版的promise在原来的基础上进行了改造，其实核心的处理没有变化，还是按照之前的思想，最大的改进
	在于引入了process.nextTick，真正实现了微任务
	// 顺便说下在2022年12月31日，这一年的最后一天，自己实现的这版promise跑通了promise A+的规范
*/
function callOnlyOnce(func) {
	let wrapFunction = function (e) {
		if (!wrapFunction.isCalled && (!wrapFunction.partner || (wrapFunction.partner && !wrapFunction.partner.isCalled))) {
			wrapFunction.isCalled = true
			return func(e)
		}
	}
	wrapFunction.isCalled = false
	wrapFunction.partner = null
	wrapFunction.addPartner = function (e) {
		wrapFunction.partner = e
	}
	return wrapFunction
}
class Promiser {
	state = 'pending'
	value = null
	subscribeInstance = []
	onFulfilled = null
	onRejected = null
	constructor(func) {
		func.call(this, this.resolve.bind(this), this.reject.bind(this))
	}

	then(onFulfilled, onRejected) {
		// 按照promise调用时候的链式写法，虽然then接收的回调函数是异步执行的，但是直接挂在promise上的一串then方法，是一次性执行完的
		const { state } = this
		const that = this
		return new Promiser(function () {
			this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled.bind(undefined) : onFulfilled
			this.onRejected = typeof onRejected === 'function' ? onRejected.bind(undefined) : onRejected
			that.subscribeInstance.push(this)
			// 如果此时promise状态已经变了，那么再次执行一下process
			if (state !== 'pending') {
				process.nextTick(that.process.bind(that))
			}
		})
	}

	resolve(e) {
		const that = this
		if (e === this) {
			this.reject(new TypeError('Chaining cycle detected for promise'))
		} else if (e instanceof Promiser) {
			e.then(function (value) {
				that.resolve(value)
			}, function (error) {
				that.reject(error)
			})
		} else if (typeof e === 'function' || Object.prototype.toString.call(e) === '[object Object]') {
			try {
				const { then } = e
				if (typeof then === 'function') {
					const successHandle = callOnlyOnce(function (v1) {
						that.resolve(v1)
					})
					const errorHandle = callOnlyOnce(function (v2) {
						that.reject(v2)
					})
					successHandle.addPartner(errorHandle)
					errorHandle.addPartner(successHandle)
					try {
						then.call(e, successHandle, errorHandle)
					} catch (thenCalllError) {
						// TODO:添加判断
						if (successHandle.isCalled || errorHandle.isCalled) return
						else that.reject(thenCalllError)
					}
				} else {
					// 如果then方法不是函数，那么直接当做普通值处理
					if (this.state === 'pending') {
						this.state = 'fulfilled'
						this.value = e
						process.nextTick(this.process.bind(this))
					}
				}
			} catch (error) {
				this.reject(error)
			}
		} else {
			// e不是promise和thenable的情况，作为一个普通的值传递下去
			if (this.state === 'pending') {
				this.state = 'fulfilled'
				this.value = e
				process.nextTick(this.process.bind(this))
			}
		}
	}
	process() {
		const { state, value } = this
		if (this.subscribeInstance.length > 0) {
			for (let instance of this.subscribeInstance) {
				if (state === 'fulfilled' && instance.state === 'pending') {
					if (instance.onFulfilled && typeof instance.onFulfilled === 'function') {
						try {
							const thenResult = instance.onFulfilled(value)
							if (thenResult === instance) {
								throw new TypeError('循环引用了')
							}
							if (thenResult instanceof Promiser) {
								thenResult.subscribeInstance = [...thenResult.subscribeInstance, ...instance.subscribeInstance]
							} else {
								// 这块对于then方法返回的实例来说，是在执行本体后面绑定的方法
								instance.resolve(thenResult)
							}
						} catch (e) {
							instance.reject(e)
						}
					} else {
						instance.resolve(value)
					}
				} else if (state === 'rejected' && instance.state === 'pending') {
					if (instance.onRejected && typeof instance.onRejected === 'function') {
						// 如果设置了errorHandle，那么就进行处理，错误处理了以后，后面就接着正常处理就可以了
						try {
							const thenResult = instance.onRejected(value)
							if (thenResult === instance) {
								throw new TypeError('循环引用')
							}
							if (thenResult instanceof Promiser) {
								thenResult.subscribeInstance = [...thenResult.subscribeInstance, ...instance.subscribeInstance]
							} else {
								// 这块对于then方法返回的实例来说，是在执行本体后面绑定的方法
								instance.resolve(thenResult)
							}
						} catch (e) {
							instance.reject(e)
						}

					} else {
						instance.reject(value)
					}
				}
			}
		}
	}

	reject(e) {
		if (this.state === 'pending') {
			this.state = 'rejected'
			this.value = e
			process.nextTick(this.process.bind(this))
		}
	}

	static resolve(value) {
		return new Promiser(function (resolve) {
			resolve(value)
		})
	}
	static reject(e) {
		return new Promiser(function (resolve, reject) {
			reject(e)
		})
	}
}


