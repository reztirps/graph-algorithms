import { Graph } from "../../models/graph";
import { RandomGraphGenerator } from "../../models/random-graph-generator";

export class WattsStrogatz implements RandomGraphGenerator {
  graph: Graph = { nodes: [], edges: [] };

  constructor(private numNodes: number, private avgDegree: number, private rewiringProbability: number) {}

  generate(): void {
    // Initialize n nodes
    for (let i = 0; i < this.numNodes; i++) {
      this.graph.nodes.push({ id: i });
    }

    // Connect each node to k neighbors
    for (let i = 0; i < this.numNodes; i++) {
      for (let j = 1; j <= this.avgDegree / 2; j++) {
        this.graph.edges.push({ source: i, target: (i + j) % this.numNodes });
        this.graph.edges.push({ source: i, target: (i - j + this.numNodes) % this.numNodes });
      }
    }

    // Rewire edges with probability p
    for (let edge of this.graph.edges) {
      if (Math.random() < this.rewiringProbability) {
        edge.target = Math.floor(Math.random() * this.numNodes);
      }
    }
  }
}
