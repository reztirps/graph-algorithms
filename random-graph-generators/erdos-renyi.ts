import { Graph } from "../../models/graph";
import { RandomGraphGenerator } from "../../models/random-graph-generator";

export class ErdosRenyi implements RandomGraphGenerator {

  graph: Graph = { nodes: [], edges: []};

  constructor(private numNodes: number, private probConnection: number) {}

  generate() {
    // Create nodes
    for (let i = 0; i < this.numNodes; i++) {
      this.graph.nodes.push({
        id: i,
        // any other node-specific properties you want
      });
    }

    // Create edges based on the probability p
    for (let i = 0; i < this.numNodes; i++) {
      for (let j = i + 1; j < this.numNodes; j++) {
        if (Math.random() < this.probConnection) {
          this.graph.edges.push({
            source: i,
            target: j
          });
        }
      }
    }
  }
}
