import { Vector3 } from "three";
import { Graph } from "../models/graph";

export class Spherical {
  private graph: Graph;
  private radius: number;

  constructor(graph: Graph, radius: number = 250) {
    this.graph = graph;
    this.radius = radius;
    this.initializePositions();
  }

  private initializePositions(): void {
    this.graph.nodes.forEach(node => {
      if (!node.position) {
        node.position = new Vector3(
          (Math.random() - 0.5) * 100, // These values might need to be adjusted
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100
        );
      }
    });
  }

  layout(): Graph {
    const numNodes = this.graph.nodes.length;
    for (let i = 0; i < numNodes; i++) {
      const phi = Math.acos(-1 + (2 * i) / numNodes);  // Latitude
      const theta = Math.sqrt(numNodes * Math.PI) * phi;  // Longitude

      // Convert spherical coordinates to Cartesian (x, y, z)
      const x = this.radius * Math.sin(phi) * Math.cos(theta);
      const y = this.radius * Math.sin(phi) * Math.sin(theta);
      const z = this.radius * Math.cos(phi);

      this.graph.nodes[i].position.set(x, y, z);
    }

    return this.graph;
  }
}
