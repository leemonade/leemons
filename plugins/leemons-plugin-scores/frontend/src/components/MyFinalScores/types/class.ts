export interface Class {
  id: string;
  color: string;
  substages: {
    name: string;
    id: string;
  }[];
  program: {
    id: string;
    substages: {
      name: string;
      id: string;
    }[];
  };
}
