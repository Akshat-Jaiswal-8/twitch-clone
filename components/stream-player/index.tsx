"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { InfoCard } from "@/components/stream-player/InfoCard";
import { Video, VideoSkeleton } from "@/components/stream-player/Video";
import { Chat, ChatSkeleton } from "./chat";
import { ChatToggle } from "@/components/stream-player/chat-toggle";
import { Header, HeaderSkeleton } from "@/components/stream-player/header";
import { AboutCard } from "@/components/stream-player/AboutCard";
import { useViewerToken } from "@/hooks/use-viewer-token";
import { useChatSidebar } from "@/store/use-chat-sidebar";
import { LiveKitRoom } from "@livekit/components-react";

type CustomStream = {
  id: string;
  isChatEnabled: boolean;
  isChatDelayed: boolean;
  isChatFollowersOnly: boolean;
  isLive: boolean;
  thumbnailUrl: string | null;
  name: string;
};

type CustomUser = {
  id: string;
  username: string;
  bio: string | null;
  stream: CustomStream | null;
  imageUrl: string;
  _count: {
    follower: number;
  };
};

interface StreamPlayerProps {
  user: CustomUser;
  stream: CustomStream;
  isFollowing: boolean;
}

export const StreamPlayer = ({
  user,
  stream,
  isFollowing,
}: StreamPlayerProps) => {
  const { token, name, identity } = useViewerToken(user.id);
  const { collapsed } = useChatSidebar((state) => state);
  if (!name || !token || !identity) return <StreamPlayerSkeleton />;
  return (
    <>
      {collapsed && (
        <div className={"hidden lg:block fixed top-[100px] right-2 z-50"}>
          <ChatToggle />
        </div>
      )}
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
        className={cn(
          "grid grid-cols-1 lg:gap-y-0 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full",
          collapsed && "lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2",
        )}
      >
        <div className="space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar pb-10">
          <Video hostname={user.username} hostIdentity={user.id} />
          <Header
            hostName={user.username}
            hostIdentity={user.id}
            name={stream.name}
            isFollowing={isFollowing}
            imageUrl={user.imageUrl}
            viewerIdentity={identity}
          />
          <InfoCard
            hostIdentity={user.id}
            viewerIdentity={identity}
            name={stream.name}
            thumbnailUrl={stream.thumbnailUrl}
          />
          <AboutCard
            hostIdentity={user.id}
            viewerIdentity={identity}
            hostName={user.username}
            bio={user.bio}
            followedByCount={user._count.follower}
          />
        </div>
        <div className={cn("col-span-1", collapsed && "hidden")}>
          <Chat
            viewername={name}
            hostIdentity={user.id}
            hostname={user.username}
            isFollowing={isFollowing}
            isChatEnabled={stream.isChatEnabled}
            isChatDelayed={stream.isChatDelayed}
            isChatFollowersOnly={stream.isChatFollowersOnly}
          />
        </div>
      </LiveKitRoom>
    </>
  );
};

export const StreamPlayerSkeleton = () => {
  return (
    <div
      className={
        "grid grid-cols-1 lg:gap-y-0 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full"
      }
    >
      <div
        className={
          "space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar pb-0"
        }
      >
        <VideoSkeleton />
        <HeaderSkeleton />
      </div>
      <div className={"col-span-1 bg-background"}>
        <ChatSkeleton />
      </div>
    </div>
  );
};
