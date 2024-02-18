"use client";

import React, { useState, useRef } from "react";

import { useInterval } from "../hooks/useInterval";

type ExerciseAPIResponse = {
  id: number;
  name: string;
  description: string;
  image: string;
  videoId: string;
  length: number;
  createdAt: Date;
  updatedAt: Date;
};

const BREAK_DURATION = 5;

interface ExerciseListProps {
  exercises: ExerciseAPIResponse[];
}

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises }) => {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [timeElapsed, setTimeElapsed] = React.useState(BREAK_DURATION);
  const [isBreak, setIsBreak] = useState(true);
  const [timerStatus, setTimerStatus] = React.useState("idle");
  const videoRefs = useRef(Array(exercises.length).fill(null));

  useInterval(
    () => {
      setTimeElapsed((timeElapsed) => timeElapsed - 1);
      if (timeElapsed === 1) {
        onTimerComplete();
      }
    },
    timerStatus === "running" ? 1000 : null,
  );

  const toggleTimer = () => {
    setTimerStatus((status) => (status === "running" ? "idle" : "running"));
  };

  const handlePrev = () => {
    setExerciseIndex((prevIndex) => {
      return prevIndex > 0 ? prevIndex - 1 : 0;
    });
  };

  const handleNext = () => {
    setExerciseIndex((prevIndex) => {
      return prevIndex < exercises.length - 1 ? prevIndex + 1 : prevIndex;
    });
  };

  const onTimerComplete = () => {
    // TODO: play sound
    console.log({ exerciseIndex });

    if (isBreak) {
      setIsBreak(false);
      if (exercises.length >= exerciseIndex) {
        setTimeElapsed(exercises[exerciseIndex]?.length ?? 0);
      }

      try {
        // play the video
        videoRefs.current[exerciseIndex].play();
      } catch (error) {
        console.log(error);
      }
    } else {
      setIsBreak(true);
      setTimeElapsed(BREAK_DURATION);
      videoRefs.current[exerciseIndex].pause();
      handleNext();
    }
  };

  return (
    <>
      <div className="h-[75vh] w-auto overflow-y-auto overflow-x-clip pr-6">
        {exercises.map(({ id, name, length }, index) => (
          <div
            key={id}
            className={`bg-purple mb-8 flex h-40 w-96 flex-row rounded-lg border-2 text-lg font-bold ${exerciseIndex === index ? "border-white" : "border-transparent"}`}
            onClick={() => setActiveExercise(id)}
          >
            <div className="flex items-center justify-center overflow-hidden rounded-lg pl-6 pr-10">
              <video
                ref={(element) => {
                  videoRefs.current[index] = element;
                }}
                className="scale-150"
                width="120"
                height="160"
                loop
                controls
              >
                <source src="./test.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div>
              <div className="px-2 pt-4">{name}</div>
              <div className="px-2 pt-4">1 Set - {length}s </div>
            </div>
          </div>
        ))}

        <div className="sticky bottom-0 w-96 bg-slate-400 bg-opacity-95">
          <div className="w-ma mb-4 ml-auto mr-auto mt-8 max-w-fit text-3xl">
            <div>{timeElapsed}</div>
          </div>
          <div className="ml-auto mr-auto max-w-fit">
            <button className="btn-square btn" onClick={handlePrev}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="currentColor"
                stroke="currentColor"
              >
                <path d="M10.6,12.71a1,1,0,0,1,0-1.42l4.59-4.58a1,1,0,0,0,0-1.42,1,1,0,0,0-1.41,0L9.19,9.88a3,3,0,0,0,0,4.24l4.59,4.59a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.42Z" />
              </svg>
            </button>
            <button className="btn-square btn" onClick={toggleTimer}>
              {timerStatus === "running" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                >
                  <path d="M6.5,0A3.5,3.5,0,0,0,3,3.5v17a3.5,3.5,0,0,0,7,0V3.5A3.5,3.5,0,0,0,6.5,0ZM8,20.5a1.5,1.5,0,0,1-3,0V3.5a1.5,1.5,0,0,1,3,0Z" />
                  <path d="M17.5,0A3.5,3.5,0,0,0,14,3.5v17a3.5,3.5,0,0,0,7,0V3.5A3.5,3.5,0,0,0,17.5,0ZM19,20.5a1.5,1.5,0,0,1-3,0V3.5a1.5,1.5,0,0,1,3,0Z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                >
                  <path d="M20.494,7.968l-9.54-7A5,5,0,0,0,3,5V19a5,5,0,0,0,7.957,4.031l9.54-7a5,5,0,0,0,0-8.064Zm-1.184,6.45-9.54,7A3,3,0,0,1,5,19V5A2.948,2.948,0,0,1,6.641,2.328,3.018,3.018,0,0,1,8.006,2a2.97,2.97,0,0,1,1.764.589l9.54,7a3,3,0,0,1,0,4.836Z" />
                </svg>
              )}
            </button>
            <button className="btn-square btn" onClick={handleNext}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="currentColor"
                stroke="currentColor"
              >
                <path d="M15.4,9.88,10.81,5.29a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42L14,11.29a1,1,0,0,1,0,1.42L9.4,17.29a1,1,0,0,0,1.41,1.42l4.59-4.59A3,3,0,0,0,15.4,9.88Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExerciseList;
