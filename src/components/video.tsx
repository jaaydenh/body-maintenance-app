"use client";

import React from "react";

interface VideoProps {
  fileName: string;
  videoRef: (element: HTMLVideoElement) => void;
}

const onCanPlay = (fileName: string) => {
  console.log(`Video onCanPlay ${fileName}`);
};

const Video: React.FC<VideoProps> = ({ fileName, videoRef }) => {
  // const { blobs } = await list({
  //   prefix: fileName,
  //   limit: 1,
  // });
  // const { url } = blobs[0];

  return (
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
  );
};

export default Video;
