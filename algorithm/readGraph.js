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

module.exports = {
	ReadGraph, Component
}