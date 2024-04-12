"use client";

import React from "react";
import { Skeleton } from "@nextui-org/react";

interface VideoProps {
  fileName: string;
  videoRef: (element: HTMLVideoElement) => void;
}

const Video: React.FC<VideoProps> = ({ fileName, videoRef }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  // const { blobs } = await list({
  //   prefix: fileName,
  //   limit: 1,
  // });
  // const { url } = blobs[0];

  const onCanPlay = (fileName: string) => {
    console.log(`Video loaded data ${fileName}`);
  };

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
  });

  return (
    <Skeleton isLoaded={isLoaded} className="rounded-lg">
      <video
        ref={videoRef}
        className="scale-150"
        width="120"
        height="160"
        loop
        muted
        controls
        preload="auto"
        playsInline
        aria-label="Video player"
        onCanPlay={() => onCanPlay(fileName)}
      >
        <source src={fileName} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </Skeleton>
  );
};

export default Video;
