const { ReadGraph, Component, Path, ShortestPath,LazyPrimMST,Krusk } = require('./readGraph')
const { Edge } = require('./weight-graph')
class sIterator {
	constructor(graph, v) {
		this.graph = graph
		this.v = v
		this.index = 0
	}

	begin() {
		if (this.graph.g.length !== 0) {
			return this.graph.g[this.v][0]
		}
		return null
	}
	next() {
		this.index++
		if (this.index < this.graph.g[this.v].length) {
			return this.graph.g[this.v][this.index]
		}
		return null
	}
	end() {
		return this.index >= this.graph.g[this.v].length
	}
}
class dIterator {
	constructor(graph, v) {
		this.graph = graph
		this.v = v
		this.index = 0
	}

	begin() {
		this.index = -1
		return this.next()
	}
	next() {
		for (this.index++; this.index < this.graph.V(); this.index++) {
			if (this.graph.g[this.v][this.index]) {
				return this.graph.g[this.v][this.index]
			}
		}
	}
	end() {
		return this.index >= this.graph.V()
	}
}
class DenseGraph {
	constructor(n, direacted) {
		this.iterator = dIterator
		// n为点数
		this.n = n;
		// m为边数
		this.m = 0;
		this.direacted = direacted;
		this.g = []
		for (let i = 0; i < n; i++) {
			this.g.push(new Array(n).fill(null))
		}
	}
	V() {
		return this.n
	}

	E() {
		return this.m
	}
	// v,w为两个点
	addEdge(v, w, weight) {
		if (v < 0 || v >= this.n) {
			return
		}
		if (w < 0 || w >= this.n) {
			return
		}
		if (this.hasEdge(v, w)) {
			this.g[v][w] = null
			if (!this.direacted) {
				this.g[w][v] = null
			}
			this.m--
		}
		this.g[v][w] = new Edge(v, w, weight)
		if (!this.direacted) {
			this.g[w][v] = new Edge(v, w, weight)
		}
		this.m++
	}
	hasEdge(v, w) {
		if (v < 0 || v >= this.n) {
			return
		}
		if (w < 0 || w >= this.n) {
			return
		}
		return this.g[v][w] !== null
	}

	show() {
		for (let i = 0; i < this.n; i++) {
			let res = ''
			for (let j = 0; j < this.g[i].length; j++) {
				if(this.g[i][j]){
					res = `${res}   ${this.g[i][j].wt()}`
				}else{
					res = `${res} null`
				}
			}
			console.log(`${res}\r`)
		}
		console.log('end',)
	}

}

class SparseGraph {
	static iterator = sIterator
	constructor(n, direacted) {
		this.iterator = sIterator
		// n为点数
		this.n = n;
		// m为边数
		this.m = 0;
		this.direacted = direacted;
		this.g = []
		for (let i = 0; i < n; i++) {
			this.g.push([])
		}
	}
	V() {
		return this.n
	}

	E() {
		return this.m
	}
	// v,w为两个点
	addEdge(v, w,weight) {
		if (v < 0 || v >= this.n) {
			return
		}
		if (w < 0 || w >= this.n) {
			return
		}
		// if (this.hasEdge(v, w)) {
		// 	return
		// }
		this.g[v].push(new Edge(v,w,weight))
		if (!this.direacted && v !== w) {
			this.g[w].push(new Edge(w,v,weight))
		}
		this.m++
	}
	// 可以看出hasEdge判断复杂度为O(n)级别，如果在addEdge中使用，则addEdge也变为了O(n)级，消耗较大，因此暂不使用
	// 由此也可看出稀疏图在处理此类问题上的缺陷，判断是否已有边需要通过遍历来实现，消耗较大
	hasEdge(v, w) {
		if (v < 0 || v >= n) {
			return
		}
		if (w < 0 || w >= n) {
			return
		}
		let res = false
		this.g[v].forEach(e=>{
			if(e.other(v) === w){
				res = true
			}
		})
		return res
	}
	show() {
		for (let i = 0; i < this.n; i++) {
			let res = ''
			for (let j = 0; j < this.g[i].length; j++) {
				res = `${res} ${this.g[i][j].wt()}`
			}
			console.log(`vertex ${i}:${res}`)
		}
		console.log('end',)
	}

}


function ergodic1() {
	let n = 20;
	let m = 100;
	let G = new SparseGraph(20, false)
	for (let i = 0; i < m; i++) {
		const a = Math.floor(Math.random() * n)
		const b = Math.floor(Math.random() * n)
		G.addEdge(a, b)
	}
	// console.log('res is:',JSON.stringify({data:G.g}) )
	for (let j = 0; j < n; j++) {
		const adj = new sIterator(G, j)
		let start = `${j}:`
		for (let w = adj.begin(); !adj.end(); w = adj.next()) {
			start += `|${w}`
		}
		console.log(start)
		console.log('end',)
	}
	console.log('end',)
}
function ergodic2() {
	let n = 20;
	let m = 100;
	let G = new DenseGraph(20, false)
	for (let i = 0; i < m; i++) {
		const a = Math.floor(Math.random() * n)
		const b = Math.floor(Math.random() * n)
		G.addEdge(a, b)
	}
	// console.log('res is:',JSON.stringify({data:G.g}) )
	for (let j = 0; j < n; j++) {
		const adj = new dIterator(G, j)
		let start = `${j}:`
		for (let w = adj.begin(); !adj.end(); w = adj.next()) {
			start += `|${w}`
		}
		console.log(start)
		console.log('end',)
	}
	console.log('end',)
}
// ergodic1()
// ergodic2()

function test1() {
	const filename = 'graph1.txt'
	const g1 = new SparseGraph(8, false)
	const r1 = new ReadGraph(g1, filename)
	g1.show()
	// const g2 = new DenseGraph(8, false)
	// const r2 = new ReadGraph(g2, filename)
	// g2.show()
}


function test2() {
	const g1 = new SparseGraph(13, false)
	const r1 = new ReadGraph(g1, 'graph1.txt')
	const component1 = new Component(g1)
	const g2 = new SparseGraph(7, false)
	const r2 = new ReadGraph(g2, 'graph2.txt')
	const component2 = new Component(g2)
	console.log('component1:', component1.ccount)
	console.log('component2', component2.ccount)
}

function test3() {
	const g1 = new SparseGraph(13, false)
	const r1 = new ReadGraph(g1, 'graph1.txt')
	const path = new Path(g1, 0)
	path.showPath(6)
	const shortestPath = new ShortestPath(g1, 0)
	shortestPath.showPath(6)
}

function test4(){
	const filename = 'graph1.txt'
	const g1 = new SparseGraph(8, false)
	const r1 = new ReadGraph(g1, filename)
	const minMST = new LazyPrimMST(g1)
	console.log('the result is :',minMST.result())
}
function test5(){
	const filename = 'graph1.txt'
	const g1 = new SparseGraph(8, false)
	const r1 = new ReadGraph(g1, filename)
	const minMST = new Krusk(g1)
	console.log('the result is :',minMST.result())
}

// test4()
test5()
