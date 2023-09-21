import { Vector3 } from './vector3';
import { Graph } from '../models/graph';

export interface FruchtermanReingold3DOptions {
  area?: number;
  maxIterations?: number;
  jitter?: number;
  gravityForce?: number;
  temperatureMultiplier?: number;
  coolDownFactor?: number;
  repulsionMultiplier?: number;
  attractionMultiplier?: number;
}

export class FruchtermanReingold3D {
  graph: Graph;
  temperature: number;
  area: number;
  k: number;
  maxIterations: number;
  jitter: number;
  gravityForce: number;
  coolDownFactor: number;
  temperatureMultiplier: number;
  repulsionMultiplier: number;
  attractionMultiplier: number;

  constructor(graph: Graph, options?: FruchtermanReingold3DOptions) {
    const {
      area = 1000,
      maxIterations = 100,
      jitter = 5,
      gravityForce = 0.01,
      coolDownFactor = 0.95,
      temperatureMultiplier = 2,
      repulsionMultiplier = 1,
      attractionMultiplier = 1
    } = options || {};

    this.graph = graph;
    this.area = area;
    this.temperatureMultiplier = temperatureMultiplier;
    this.temperature = this.temperatureMultiplier * Math.sqrt(this.area) / 10;
    this.k = Math.sqrt(this.area / this.graph.nodes.length);
    this.maxIterations = maxIterations;
    this.jitter = jitter;
    this.gravityForce = gravityForce;
    this.coolDownFactor = coolDownFactor;
    this.attractionMultiplier = attractionMultiplier;
    this.repulsionMultiplier = repulsionMultiplier;

    this.initializePositions();
  }

  get running(): boolean {
    return this.temperature > 0.001;
  }

  private initializePositions(): void {
    this.graph.nodes.forEach(node => {
      if (!node.position) {
        node.position = new Vector3(
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100
        );
      }
    });
  }

  // Repulsive force between nodes
  repulsiveForce(distance: number): number {
    // return - (this.repulsionMultiplier * this.k * this.k) / distance;
    return -(this.repulsionMultiplier * this.k * this.k) / Math.pow(distance, 2);
  }

  // Attractive force between nodes
  // attractiveForce(distance: number): number {
  //   return (distance * distance) / this.k;
  // }
  attractiveForce(distance: number): number {
    return this.attractionMultiplier * (distance * Math.log(distance / this.k));
  }

  step() {
    if (this.temperature < 0.01) {
      return;
    }

    this.graph.nodes.forEach(v => {
      v.displacement = new Vector3(0, 0, 0);

      this.graph.nodes.forEach(u => {
        if (u !== v) {
          const delta = v.position.clone().sub(u.position);
          const distance = delta.length() || 1;
          const force = this.repulsiveForce(distance) / distance;
          v.displacement.add(delta.multiplyScalar(force));
        }
      });

      const gravitationalDelta = v.position.clone().negate().normalize().multiplyScalar(this.gravityForce);
      v.displacement.add(gravitationalDelta);
    });

    this.graph.edges.forEach(edge => {
      const source = this.graph.nodes[edge.source];
      const target = this.graph.nodes[edge.target];
      const delta = source.position.clone().sub(target.position);
      const distance = delta.length() || 1;
      const force = (this.attractiveForce(distance) - this.repulsiveForce(distance)) / distance;

      source.displacement.sub(delta.multiplyScalar(force));
      target.displacement.add(delta.multiplyScalar(force));
    });

    this.graph.nodes.forEach(node => {

      const maxMove = this.temperature;
      node.position.add(node.displacement.clampLength(0, maxMove));

      // Introducing jitter
      const currentJitter = this.jitter * (this.temperature / (Math.sqrt(this.area) / 10));
      node.position.x += (Math.random() - 0.5) * currentJitter;
      node.position.y += (Math.random() - 0.5) * currentJitter;
      node.position.z += (Math.random() - 0.5) * currentJitter;

      node.position.x = Math.min(this.area / 2, Math.max(-this.area / 2, node.position.x));
      node.position.y = Math.min(this.area / 2, Math.max(-this.area / 2, node.position.y));
      node.position.z = Math.min(this.area / 2, Math.max(-this.area / 2, node.position.z));
    });
  }

  layout(): Graph {
    for (let iteration = 0; iteration < this.maxIterations; iteration++) {

      this.step();

      // Reduce the temperature as layout progresses
      this.coolDown(iteration);
    }

    return this.graph;
  }

  // coolDown(): void {
  //   this.temperature *= 0.95;
  // }
  coolDown(iteration?: number): void {
    // if (iteration) {
    //   this.temperature = this.temperature / (1 + this.temperature * Math.log(1 + iteration) / Math.sqrt(this.graph.nodes.length));
    // } else {
      this.temperature *= this.coolDownFactor;
    // }
  }

}
