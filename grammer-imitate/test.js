class Promiser {
	state = 'pending'
	value = null
	subscribeInstance = []
	constructor(func) {
		func(this.resolve.bind(this), this.reject.bind(this))
	}

	then(successHandle, errorHandle) {
		const { state, value,error, subscribeInstance } = this
		return new Promiser(function (resolve, reject) {
			// resolve是异步执行的，此时resolve还未执行
			if (state === 'pending') {
				this.successHandle = successHandle
				this.errorHandle = errorHandle
				subscribeInstance.push(this)
			} else if (state === 'fullfilled') {
				// resolve同步执行，此时resolve已经执行完毕，这个successHandle，其实就相当于是现在这个promise生成时接收的函数
				const handleResult = successHandle(value)
				// 如果是个promise实例，那么当前实例就不用要了，直接返回这个实例，后面的交给它处理就好了
				if (handleResult instanceof Promiser) return handleResult
				else resolve(handleResult)
			} else {
				if (errorHandle) {
					const handleResult = errorHandle(error)
					if (handleResult instanceof Promiser) return handleResult
					else (resolve(handleResult))
				} else {
					reject(error)
				}
			}
		})
	}

	resolve(e) {
		// 改变当前promise实例的状态和储存值
		this.state = 'fullfilled'
		this.value = e
		// this.subscribeInstance.length如果大于0，说明本次resolve是异步执行的，需要处理后面then方法提前在subscribeInstance中存好的待处理的实例
		if (this.subscribeInstance.length > 0) {
			for (instance of this.subscribeInstance) {
				// 这块对于then方法返回的实例来说，是在执行本体的方法，就像是普通的new Promise执行的时候，本体中的代码
				const thenResult = instance.successHandle(e)
				if (thenResult instanceof Promiser) {
					thenResult.subscribeInstance = [...thenResult.subscribeInstance, ...instance.subscribeInstance]
				} else {
					// 这块对于then方法返回的实例来说，是在执行本体后面绑定的方法
					instance.resolve(thenResult)
				}
			}
		}
	}

	reject(e) {
		this.state = 'failed'
		this.error = e
		// 处理后续的相关的promise
		if (this.subscribeInstance.length > 0) {
			for (instance of this.subscribeInstance) {
				// 这块对于then方法返回的实例来说，是在执行本体的方法，就像是普通的new Promise执行的时候，本体中的代码
				if (instance.errorHandle) {
					// 这里的判断就是看看then方法返回的promise实例中，有没有负责错误处理的函数，有的话就处理，处理了以后
					// 靠then连起来的“链条”就又恢复正常了，所以接着往下执行,没有的话，就直接执行reject，相当于跨过当前实例
					// 的处理环节（因为没有给处理环节），接着把错误传递给后面的实例，看看有没有能够处理的
					const thenResult = instance.errorHandle(e)
					if (thenResult instanceof Promiser) {
						thenResult.subscribeInstance = [...thenResult.subscribeInstance, ...instance.subscribeInstance]
					} else {
						// 这块对于then方法返回的实例来说，是在执行本体后面绑定的方法
						instance.resolve(thenResult)
					}
				} else {
					instance.reject(e)
				}

			}
		}
	}

	catch(catchHandle) {
		this.then(null, catchHandle)
	}
}









const p = new Promiser(function (resolve, reject) {
	console.log('1111111111111111111111',)
	setTimeout(function () {
		reject('error')
	}, 3000)
}).then(function () {
	console.log('p1')
	return 3
}, function () {
	return new Promiser(function (resolve, reject) {
		setTimeout(function () {
			console.log('reject--handled',)
			resolve('yes')
		}, 2000)
	})
}).then(function (e) { console.log('haha', e) })






