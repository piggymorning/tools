const fs = require('fs');
class ReadGraph {
	constructor(graph, filename) {
		let list = []
		const content = fs.readFileSync(filename, 'utf-8')
		content.split(/\r?\n/).forEach(line => {
			list.push(line)
		});
		const [V, E] = list.shift()
		for (let i = 0; i < list.length; i++) {
			const [n, m] = list[i].split(' ')
			graph.addEdge(n, m)
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


module.exports = {
	ReadGraph, Component, Path
}