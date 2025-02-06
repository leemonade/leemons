export interface Class {
  id: string;
  color: string;
  program: {
    id: string;
    substages: {
      name: string;
      id: string;
    }[];
  };
}
