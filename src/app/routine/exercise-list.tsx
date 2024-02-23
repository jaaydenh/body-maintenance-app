"use client";

import React, { useState, useRef } from "react";

import { useInterval } from "../hooks/useInterval";

type ExerciseAPIResponse = {
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

const BREAK_DURATION = 5;

interface ExerciseListProps {
  exercises: ExerciseAPIResponse[];
}

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises }) => {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [timeElapsed, setTimeElapsed] = React.useState(BREAK_DURATION);
  const [setsRemaining, setSetsRemaining] = useState(exercises[0]?.sets ?? 1);
  const [side, setSide] = React.useState("right");
  const [isBreak, setIsBreak] = useState(true);
  const [timerStatus, setTimerStatus] = React.useState("idle");
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  if (videoRefs.current[exerciseIndex]) {
    videoRefs.current[exerciseIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }

  useInterval(
    () => {
      setTimeElapsed((timeElapsed) => timeElapsed - 1);
      if (timeElapsed === 1) {
        timerComplete();
      }
    },
    timerStatus === "running" ? 1000 : null,
  );

  const toggleTimer = () => {
    setTimerStatus((status) => (status === "running" ? "idle" : "running"));
  };

  const handlePrev = () => {
    if (exerciseIndex === 0) return;

    setSetsRemaining(exercises[exerciseIndex + -1]?.sets ?? 1);
    setExerciseIndex((prevIndex) => {
      return prevIndex > 0 ? prevIndex - 1 : 0;
    });
  };

  const handleNext = () => {
    setSetsRemaining(exercises[exerciseIndex + 1]?.sets ?? 1);
    setExerciseIndex((prevIndex) => {
      return prevIndex < exercises.length - 1 ? prevIndex + 1 : prevIndex;
    });
  };

  const timerComplete = () => {
    // TODO: play sound

    if (isBreak) {
      setIsBreak(false);
      if (exercises.length >= exerciseIndex) {
        setTimeElapsed(exercises[exerciseIndex]?.length ?? 0);
      }

      try {
        if (typeof videoRefs.current !== "undefined") {
          videoRefs.current[exerciseIndex]?.play().then(
            (value) => {
              console.log(value);
            },
            (error) => {
              throw error;
            },
          );
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setIsBreak(true);
      setTimeElapsed(BREAK_DURATION);
      videoRefs.current[exerciseIndex]?.pause();
      if (exercises[exerciseIndex]?.unilateral) {
        setSide((current) => (current === "left" ? "right" : "left"));
      }
      if (setsRemaining === 1) {
        if (exercises[exerciseIndex]?.unilateral) {
          if (side === "left") {
            handleNext();
          }
        } else {
          handleNext();
        }
      } else {
        setSetsRemaining((current) => current - 1);
      }
    }
  };

  return (
    <>
      <div className="h-[85vh] w-auto overflow-y-auto overflow-x-clip pr-2">
        <div
          className={`sticky top-0 z-10 h-10 bg-slate-400 bg-opacity-95 p-2 ${isBreak ? "bg-orange-500" : "bg-green-500"}`}
        >
          <div className="text-1xl mb-3 font-bold">
            <ul className="flex flex-row justify-between">
              <li>{exercises[exerciseIndex]?.unilateral && side}</li>
              <li>{isBreak ? "Break" : exercises[exerciseIndex]?.name}</li>
              <li>
                Set {exercises[exerciseIndex]?.sets ?? 1 - setsRemaining + 1}/
                {exercises[exerciseIndex]?.sets}
              </li>
            </ul>
          </div>
        </div>
        {exercises.map(({ id, name, length, videoId, sets }, index) => (
          <div
            key={id}
            className={`mb-8 flex h-40 w-96 flex-row rounded-lg border-2 bg-purple text-lg ${exerciseIndex === index ? "border-white" : "border-transparent"}`}
            onClick={() => setExerciseIndex(index)}
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
                <source src={`./${videoId}.mp4`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div>
              <div className="px-2 pt-4 font-medium">{name}</div>
              <div className="px-2 pt-4 text-sm font-normal">
                {sets} {sets > 1 ? "Sets" : "Set"} - {length}s{" "}
              </div>
            </div>
          </div>
        ))}

        <div className="sticky bottom-0 h-28 rounded-lg bg-slate-400 bg-opacity-95 p-2">
          {/* <div className="text-1xl mb-3 ml-auto mr-auto max-w-fit">
            <div>{isBreak ? "Break" : exercises[exerciseIndex]?.name}</div>
          </div> */}
          <div className="mt-4 flex justify-evenly">
            <button onClick={handlePrev}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
              >
                <path d="M10.6,12.71a1,1,0,0,1,0-1.42l4.59-4.58a1,1,0,0,0,0-1.42,1,1,0,0,0-1.41,0L9.19,9.88a3,3,0,0,0,0,4.24l4.59,4.59a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.42Z" />
              </svg>
            </button>
            <button onClick={toggleTimer}>
              {timerStatus === "running" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
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
                  className="h-8 w-8"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                >
                  <path d="M20.494,7.968l-9.54-7A5,5,0,0,0,3,5V19a5,5,0,0,0,7.957,4.031l9.54-7a5,5,0,0,0,0-8.064Zm-1.184,6.45-9.54,7A3,3,0,0,1,5,19V5A2.948,2.948,0,0,1,6.641,2.328,3.018,3.018,0,0,1,8.006,2a2.97,2.97,0,0,1,1.764.589l9.54,7a3,3,0,0,1,0,4.836Z" />
                </svg>
              )}
            </button>
            <button onClick={handleNext}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
              >
                <path d="M15.4,9.88,10.81,5.29a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42L14,11.29a1,1,0,0,1,0,1.42L9.4,17.29a1,1,0,0,0,1.41,1.42l4.59-4.59A3,3,0,0,0,15.4,9.88Z" />
              </svg>
            </button>
          </div>
          <div className="w-ma mb-1 ml-auto mr-auto mt-3 max-w-fit text-2xl font-bold">
            <div>{timeElapsed}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExerciseList;
