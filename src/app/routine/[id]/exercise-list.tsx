"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronRight, ChevronLeft, Play, Pause } from "lucide-react";
import { Howl } from "howler";

import { useInterval } from "../../hooks/useInterval";
import Video from "@/components/video";
import { type ExerciseAPIResponse } from "~/app/types";

const BREAK_DURATION = 5;

interface ExerciseListProps {
  exercises: ExerciseAPIResponse[];
  status: string;
  handleStatusChange: (nextStatus: string) => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({
  exercises,
  status,
  handleStatusChange,
}) => {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [timeElapsed, setTimeElapsed] = React.useState(BREAK_DURATION);
  const [setsRemaining, setSetsRemaining] = useState(exercises[0]?.sets ?? 1);
  const [side, setSide] = React.useState("right");
  const [isBreak, setIsBreak] = useState(true);
  const [timerStatus, setTimerStatus] = React.useState("idle");
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const exerciseAudio = useRef(new Array<Howl>());
  const startExerciseSfx = new Howl({ src: [`/sfx/start-exercise.mp3`] });
  const almostDoneSfx = new Howl({ src: [`/sfx/almost-done.mp3`] });
  const routineCompleteSfx = new Howl({ src: [`/sfx/routine-completed.mp3`] });

  useEffect(() => {
    exerciseAudio.current = exercises.map((exercise) => {
      return new Howl({ src: [`/audio/${exercise.videoId}.mp3`] });
    });
  }, [exercises]);

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
      if (timeElapsed === 11) {
        almostDoneSfx.play();
      }
      if (timeElapsed === 1) {
        timerComplete().then(
          () => console.log("timer complete"),
          (error) => console.log(error),
        );
      }
    },
    timerStatus === "running" ? 1000 : null,
  );

  const toggleTimer = async () => {
    setTimerStatus((status) => (status === "running" ? "idle" : "running"));
  };

  const handlePrev = async () => {
    if (exerciseIndex === 0) return;

    setSetsRemaining(exercises[exerciseIndex + -1]?.sets ?? 1);
    setExerciseIndex((prevIndex) => {
      return prevIndex > 0 ? prevIndex - 1 : 0;
    });

    exerciseAudio.current[exerciseIndex - 1]?.play();
  };

  const handleNext = async () => {
    setSetsRemaining(exercises[exerciseIndex + 1]?.sets ?? 1);
    setExerciseIndex((prevIndex) => {
      return prevIndex < exercises.length - 1 ? prevIndex + 1 : prevIndex;
    });

    exerciseAudio.current[exerciseIndex + 1]?.play();
  };

  const handleStartRoutine = async () => {
    handleStatusChange("inProgress");
    exerciseAudio.current[exerciseIndex]?.play();
    await toggleTimer();
  };

  const timerComplete = async () => {
    if (isBreak) {
      if (exerciseIndex < exercises.length) {
        setTimeElapsed(exercises[exerciseIndex]?.length ?? 0);
      }
      setIsBreak(false);

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
      startExerciseSfx.play();
    } else {
      if (exerciseIndex === exercises.length - 1 && setsRemaining === 1) {
        handleStatusChange("completed");
        routineCompleteSfx.play();
      }
      setIsBreak(true);
      setTimeElapsed(BREAK_DURATION);
      videoRefs.current[exerciseIndex]?.pause();
      if (exercises[exerciseIndex]?.unilateral) {
        setSide((current) => (current === "left" ? "right" : "left"));
      }
      if (setsRemaining === 1) {
        if (exercises[exerciseIndex]?.unilateral) {
          if (side === "left") {
            await handleNext();
          }
        } else {
          await handleNext();
        }
      } else {
        setSetsRemaining((current) => current - 1);
      }
    }
  };

  return (
    <>
      <div className="h-[85vh] w-auto overflow-y-auto overflow-x-clip pr-2">
        {status === "inProgress" && (
          <div
            className={`sticky top-0 z-10 bg-opacity-95 p-2 ${isBreak || timerStatus === "idle" ? "bg-orange-500" : "bg-green-500"}`}
          >
            <div className="text-1xl mb-1 font-bold">
              <ul className="flex flex-row justify-around">
                <li></li>
                <li>{exercises[exerciseIndex]?.unilateral && side}</li>
                <li>{isBreak ? "Break" : exercises[exerciseIndex]?.name}</li>
                <li>
                  Set {exercises[exerciseIndex]?.sets ?? 1 - setsRemaining + 1}/
                  {exercises[exerciseIndex]?.sets}
                </li>
              </ul>
              {timerStatus === "idle" && (
                <div className="mt-3 flex justify-center">Paused</div>
              )}
            </div>
          </div>
        )}
        {exercises.map(({ id, name, length, videoId, sets }, index) => (
          <div
            key={id}
            className={`mb-8 flex h-40 w-96 flex-row rounded-lg border-2 bg-purple text-lg ${exerciseIndex === index ? "border-white" : "border-transparent"}`}
            onClick={() => setExerciseIndex(index)}
          >
            <div className="flex items-center justify-center overflow-hidden rounded-lg pl-6 pr-10">
              <Video
                fileName={`../video/${videoId}.mp4`}
                videoRef={(element: HTMLVideoElement) => {
                  videoRefs.current[index] = element;
                }}
              />
            </div>
            <div>
              <div className="px-2 pt-4 font-medium">{name}</div>
              <div className="px-2 pt-4 text-sm font-normal">
                {sets} {sets > 1 ? "Sets" : "Set"} - {length}s{" "}
              </div>
            </div>
          </div>
        ))}
        <div className="sticky bottom-0 h-28  bg-gray-400 bg-opacity-95 p-2">
          {status !== "inProgress" ? (
            <div className="mt-6 flex justify-evenly">
              <button
                onClick={handleStartRoutine}
                className="items-center rounded-lg border border-transparent bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              >
                Start Routine
              </button>
            </div>
          ) : (
            <>
              <div className="mt-4 flex justify-evenly">
                <button onClick={handlePrev}>
                  <ChevronLeft strokeWidth={2.5} width={48} height={48} />
                </button>
                <button onClick={toggleTimer}>
                  {timerStatus === "running" ? (
                    <Pause strokeWidth={1.7} width={48} height={48} />
                  ) : (
                    <Play strokeWidth={1.7} width={48} height={48} />
                  )}
                </button>
                <button onClick={handleNext}>
                  <ChevronRight strokeWidth={2.5} width={48} height={48} />
                </button>
              </div>
              <div className="w-ma mb-1 ml-auto mr-auto mt-3 max-w-fit text-2xl font-bold">
                <div>{timeElapsed}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ExerciseList;
