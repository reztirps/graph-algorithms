import { Graph } from "../models/graph";
import { RandomGraphGenerator } from "../models/random-graph-generator";

export class GeometricRandomGraph implements RandomGraphGenerator {
  graph: Graph = { nodes: [], edges: [] };

  constructor(private numNodes: number, private radius: number) {}

  generate(): void {
    // Initialize n nodes with random positions in a unit square
    for (let i = 0; i < this.numNodes; i++) {
      this.graph.nodes.push({
        id: i,
        x: Math.random(),
        y: Math.random()
      });
    }

    // Connect nodes if they are closer than r
    for (let i = 0; i < this.numNodes; i++) {
      for (let j = i + 1; j < this.numNodes; j++) {
        const dx = this.graph.nodes[i].x - this.graph.nodes[j].x;
        const dy = this.graph.nodes[i].y - this.graph.nodes[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < this.radius) {
          this.graph.edges.push({ source: i, target: j });
        }
      }
    }
  }
}
