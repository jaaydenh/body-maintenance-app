export type Exercise = {
  id: number;
  name: string;
  description: string;
  image: string;
  videoId: string;
  length: number;
  sets: number;
  unilateral: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type RoutineExercise = {
  index: number;
  exercise: Exercise;
};
