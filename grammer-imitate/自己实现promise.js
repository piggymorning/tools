

// 1.实现错误处理，比如catch方法
// 2.需要考虑已经生成的promise，在其他的后执行的代码中，使用的情况
function Promiser(func) {
	// 当前状态
	this.state = 'pending'
	// 当前值
	this.value = null
	// 当前错误
	this.error = null
	// 已订阅此promiser实例的其他实例
	this.subscribeInstance = []
	func.call(this, this.resolve.bind(this), this.reject.bind(this))
}

Promiser.prototype.then = function (successHandle, errorHandle) {
	const that = this
	
	return new Promiser(function () {
		this.successHandle = successHandle
		this.errorHandle = errorHandle
		that.subscribeInstance.push(this)
	})
}

Promiser.prototype.resolve = function (e) {
	// 改变当前promise实例的状态和储存值
	this.state = 'fullfilled'
	this.value = e
	// 处理后续的相关的promise
	if (this.subscribeInstance.length > 0) {
		for (instance of this.subscribeInstance) {
			// 这块对于then方法返回的实例来说，是在执行本体的方法，就像是普通的new Promise执行的时候，本体中的代码
			const thenResult = instance.successHandle(e)
			if (thenResult instanceof Promiser) {
				thenResult.subscribeInstance = [...thenResult.subscribeInstance,...instance.subscribeInstance]
			} else {
				// 这块对于then方法返回的实例来说，是在执行本体后面绑定的方法
				instance.resolve(thenResult)
			}
		}
	}
}
Promiser.prototype.reject = function (e) {
	this.state = 'failed'
	this.error = e
	if (this.subscribeInstance.length > 0) {
		for (instance of this.subscribeInstance.entries()) {
			instance.reject(instance.errorHandle(e))
		}
	}
}
/* 
	这里面有几个关键点：
	1、首先，then方法后面可以无限地接then方法，那么then方法返回的一定是个promiser实例
	2、要知道虽然在使用的效果是then方面里面的函数，是等上一个promise完成之后才能执行，但实际上跑
	代码的时候，是一连气把多个then方法全部执行玩的，所以这些方法里的函数，需要提前储存好
	3、原promise和then方法返回的promise，是两个promise实例，但是后者的执行需要前者执行完resolve以后，
	才能进行，因此两个promise看似是两个独立对象，但实际上有关联。我起初的想法是在这里改变上一个promise的
	resolve方法，这样上一个promise执行resolve的时候，就连带着本次的resolve一块执行了，但是会有一个问题，
	如果是直接改resolve方法，那改的是resolve字段对函数的引用。如果then方法后面又跟了一个then方法，那么
	在第二个then方法执行的时候，就会给第二个resolve字段更换新的函数，但是第一个resolve改变后的函数是不会
	再变了，那相当于第二个then方法就接不上了。这个问题其实有个简单的解法，就是不直接去改变resolve方法本身，
	而是在resolve方法内部添加处理，在实例上添加新的对象状态用来储存每一个then方法需要添加的东西，然后在resolve
	中去引用这个对象，之所以用对象是因为对象本身是一个稳定的引用，需要改东西的话，就去改对象里面的属性，大家使用
	的时候是通过这个固定的对象去使用的，后面因为某个地方对象中的某个方法或属性改变了，其他地方只要是通过对象引用的
	那都会拿到最新的值。这其实是个常识，但最开始确实没相当
	4、最终then方法的解决方案，就是每执行一次then方法，就把新的promise实例本身直接存到上一个promise中，这样
	上个promise resolve的时候，就可以直接从自身的状态中调用到跟自身续接的promise，并执行其中的resolve方法
	5、解决了then的问题，接下来就是resolve。resolve这块有个关键问题，如果then方法返回的还是一个promise对象，该如何处理？最直观
	的想法可能是在then方法处加个判断，先执行下那个函数看看，如果是普通值就正常处理，不是普通值就返回这个promise实例，
	但这样是不行的，因为then方法接收的函数，这个时候不能执行，执行的话也没有拿到上个promise的返回值，所以还是得
	从resolve方法下手。resolve主要做两件事，第一件事是改变当前promise实例的值和状态，第二件事是执行后面绑定的处理。  
	最终的解决方案挺巧妙的，就是从promise实例的角度来看，对象中有个状态专门是存储接下来需要调用的实例的，就是then
	方法干的事，这个状态是个数组，那如果resolve的时候，发现then方法接收的函数返回的是个promise，那说明当前实例
	上绑定的后面待处理的实例们还不该执行，应该在then方法函数的promise种resolve执行以后再执行，那就把当前实例绑定的
	待执行实例们直接添加到then方法函数返回的实例对应的待执行状态中就好了
	6、                 
	*/

const p1 = new Promiser(function (resolve, reject) {
	console.log('start....',)
	setTimeout(function () {
		resolve('setTimeOut')
	}, 3000)
})

const p2 = p1.then(function (e) {
	console.log('p2',e)
	return new Promiser(function (resolve, reject) {
		setTimeout(function () {
			resolve('from p2')
		}, 3000)
	})
	
})
const p3 = p2.then(function (e) {
	console.log('p3', e)
	return new Promiser(function (resolve, reject) {
		setTimeout(function () {
			resolve('from p3')
		}, 3000)
	})
})

const p4 = p3.then(function (e) {
	console.log('p4', e)
})

const p5 = p2.then(function(e){
	console.log('this is p5:',e)
})




