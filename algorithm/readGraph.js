const { equal } = require('assert');
const fs = require('fs');
const { MinHeap } = require('./minimalHeap')
class ReadGraph {
	constructor(graph, filename) {
		let list = []
		const content = fs.readFileSync(filename, 'utf-8')
		content.split(/\r?\n/).forEach(line => {
			list.push(line)
		});
		const [V, E] = list.shift()
		for (let i = 0; i < list.length; i++) {
			const [n, m, w] = list[i].split(' ')
			graph.addEdge(n, m, Number(w))
		}
	}
}

class Component {
	constructor(graph,) {
		this.g = graph
		// 先想好需要什么状态量以及需要返回什么值
		this.visited = []
		this.ccount = 0
		this.id = new Array(this.g.V()).fill(-1)
		// 节点列表是知道的，可以直接遍历。遍历的时候，深度优先遍历。终止点就是要把所有的节点全部遍历到
		for (let i = 0; i < this.g.V(); i++) {
			if (!this.visited[i]) {
				// 从任何一个节点开始遍历，都能走完整个连通图
				this.dfs(i)
				this.ccount++
			}
		}
	}
	dfs(i) {
		this.visited[i] = true
		this.id[i] = this.ccount
		const adj = new this.g.iterator(this.g, i)
		for (let j = adj.begin(); !adj.end(); j = adj.next()) {
			if (!this.visited[j]) {
				this.dfs(j)
			}
		}
	}
	isConnected(v, w) {
		if (v < 0 || v >= this.g.V()) {
			return
		}
		if (w < 0 || w >= this.g.V()) {
			return
		}
		return this.id[v] === this.id[w]
	}
}

class Path {
	constructor(graph, s) {
		this.g = graph
		this.s = s
		this.visited = new Array(this.g.V()).fill(false)
		this.from = new Array(this.g.V()).fill(-1)
		this.pathRecord = []
		// 此处和component的区别，是直接选取一个点开始的
		if (s >= 0 && s < this.g.V()) {
			this.dfs(s)
		}
	}
	dfs(i) {
		if (this.visited[i]) {
			return
		}
		this.visited[i] = true
		const adj = new this.g.iterator(this.g, i)
		for (let j = adj.begin(); !adj.end(); j = adj.next()) {
			if (!this.visited[j]) {
				this.from[j] = Number(i)
				this.dfs(j)
			}
		}
	}

	hasPath(w) {
		return this.visited[w]
	}
	path(w) {
		const stack = []
		this.pathRecord = []
		let p = w
		while (p !== -1) {
			stack.push(p)
			p = this.from[p]
		}
		while (stack.length !== 0) {
			this.pathRecord.push(stack.pop())
		}
	}
	showPath(w) {
		this.path(w)
		let path = ''
		this.pathRecord.forEach(function (p, index) {
			path = index === 0 ? p : `${path}=>${p}`
		})
		console.log('the path is:', path)
	}

}

// 此处感觉颇为巧妙，广度优先遍历，其实就是层级遍历，层级遍历天然就等于在求最短路径，只要把中间过程记录一下即可
class ShortestPath {
	constructor(graph, s) {
		this.g = graph
		this.s = s
		this.visited = new Array(this.g.V()).fill(false)
		this.from = new Array(this.g.V()).fill(-1)
		this.ord = new Array(this.g.V()).fill(-1)
		const q = []
		q.push(s)
		this.visited[s] = true
		this.ord[s] = 0
		while (q.length > 0) {
			const i = q.shift()
			const adj = new this.g.iterator(this.g, i)
			for (let j = adj.begin(); !adj.end(); j = adj.next()) {
				if (!this.visited[j]) {
					q.push(j)
					this.from[j] = Number(i)
					this.visited[j] = true
					this.ord[j] = this.ord[i] + 1
				}
			}
		}
	}

	hasPath(w) {
		return this.visited[w]
	}
	path(w) {
		const stack = []
		this.pathRecord = []
		let p = w
		while (p !== -1) {
			stack.push(p)
			p = this.from[p]
		}
		while (stack.length !== 0) {
			this.pathRecord.push(stack.pop())
		}
	}
	showPath(w) {
		this.path(w)
		let path = ''
		this.pathRecord.forEach(function (p, index) {
			path = index === 0 ? p : `${path}=>${p}`
		})
		console.log('the path is:', path)
	}
	length(w) {
		if (w >= 0 && w < this.g.V()) {
			return this.ord[w]
		}
	}
}

class LazyPrimMST {
	constructor(graph) {
		this.g = graph
		this.marked = new Array(this.g.V()).fill(false)
		this.mstWeight = 0
		this.pq = new MinHeap()
		this.mst = []
		this.visit(0)
		while (!this.pq.isEmpty()) {
			const min = this.pq.extractMinimum()
			// 这里想判断一下这个边是不是横切边，即构成边的两个点是否一个被访问过，另一个没有
			// 之所以判断这么写，不是因为可能存在两个点都未被访问过的情况，而是这么写最简单
			// 原因是对于min中的两个点v和w，我们分不清哪个是被访问过的，那个不是
			if (this.marked[min.v()] == this.marked[min.w()]) {
				continue
			}
			this.mst.push(min)
			// 关于min这个edge已经算是找到权值最小边了，接着就应该继续访问没被访问过的点
			if (this.marked[min.v()]) {
				this.visit(min.w())
			} else {
				this.visit(min.v())
			}
		}
		this.mstWeight = this.mst[0].wt()
		console.log('this.mst----',this.mst)
		for (let i = 1; i < this.mst.length; i++) {
			this.mstWeight += Number(this.mst[i].wt())
		}
	}
	visit(v) {
		if (this.marked[v]) {
			return
		}
		this.marked[v] = true
		const adj = new this.g.iterator(this.g, v)
		for (let e = adj.begin(); !adj.end(); e = adj.next()) {
			if (!this.marked[e.other(v)]) {
				this.pq.insert(e)
			}
		}
	}
	result() {
		console.log('result----',)
		return this.mstWeight
	}

}

module.exports = {
	ReadGraph, Component, Path, ShortestPath, LazyPrimMST
} 