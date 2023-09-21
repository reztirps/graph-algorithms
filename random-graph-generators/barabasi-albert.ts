import { Graph } from '../models/graph';
import { RandomGraphGenerator } from '../models/random-graph-generator';

export class BarabasiAlbert implements RandomGraphGenerator {

  graph: Graph = { nodes: [], edges: []};

  constructor(private numNodes: number, private numEdgesPerNode: number) {}

  generate() {
    for (let i = 0; i < this.numNodes; i++) {
      this.graph.nodes.push({ id: i });
      if (i > this.numEdgesPerNode) {
        for (let j = 0; j < this.numEdgesPerNode; j++) {
          const target = Math.floor(Math.random() * i);
          this.graph.edges.push({ source: i, target });
        }
      }
    }
  }

}
