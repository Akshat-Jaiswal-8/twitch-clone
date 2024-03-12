"use client";
import React, { useEffect, useRef, useState } from "react";
import { Participant, Track } from "livekit-client";
import { TrackReference, useTracks } from "@livekit/components-react";
import { FullscreenControl } from "@/components/stream-player/fullscreen-control";
import { useEventListener } from "usehooks-ts";
import { VolumeControl } from "@/components/stream-player/volume-control";

interface LiveVideoProps {
  participant: Participant;
}
export const LiveVideo = ({ participant }: LiveVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0);

  const volumeChange = (value: number) => {
    setVolume(+value);
    if (videoRef.current) {
      videoRef.current.muted = value === 0;
      videoRef.current.volume = +value * 0.01;
    }
  };

  const toggleMute = () => {
    const isMuted = volume === 0;
    setVolume(isMuted ? 50 : 0);

    if (videoRef?.current) {
      videoRef.current.muted = !isMuted;
      videoRef.current.volume = isMuted ? 0.5 : 0;
    }
  };

  // INITIALLY THE VOLUME WILL BE ZERO.
  useEffect(() => {
    volumeChange(0);
  }, []);

  const fullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen();
    } else if (wrapperRef?.current) {
      wrapperRef.current.requestFullscreen();
    }
  };

  const handleFullScreenChange = () => {
    const isCurrentlyFullScreen: boolean = document.fullscreenElement !== null;
    setIsFullScreen(isCurrentlyFullScreen);
  };

  useEventListener("fullscreenchange", handleFullScreenChange, wrapperRef);
  useTracks([Track.Source.Camera, Track.Source.Microphone])
    .filter(
      (track: TrackReference): boolean =>
        track.participant.identity === participant.identity,
    )
    .forEach((track: TrackReference) => {
      if (videoRef.current) {
        track.publication.track?.attach(videoRef.current);
      }
    });
  return (
    <>
      <div ref={wrapperRef} className={"relative h-full flex"}>
        <video ref={videoRef} width={"100%"} />
        <div
          className={
            "absolute top-0 w-full opacity-0 hover:opacity-100 hover:transition-all"
          }
        >
          <div
            className={
              "absolute bottom-0 flex h-14 w-full items-center justify-between bg-gradient-to-r from-neutral-900 px-4"
            }
          >
            <VolumeControl
              onToggle={toggleMute}
              onChange={volumeChange}
              value={volume}
            />
            <FullscreenControl
              isFullScreen={isFullScreen}
              onToggle={fullScreen}
            />
          </div>
        </div>
      </div>
    </>
  );
};
