import { Graph } from "./graph";

export interface RandomGraphGenerator {
  graph: Graph;
  generate(): void;
}
