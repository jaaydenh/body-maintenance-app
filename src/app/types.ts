export type ExerciseAPIResponse = {
  id: number;
  name: string;
  description: string;
  videoId: string;
  length: number;
  sets: number;
  unilateral: boolean;
  createdAt: Date;
  updatedAt: Date;
};