const fs = require('fs')
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

module.exports = {
	ReadGraph,
}