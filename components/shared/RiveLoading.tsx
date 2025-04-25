"use client";

import { useRive } from "@rive-app/react-canvas";

export default function RiveLoading() {
  const { RiveComponent } = useRive({
    src: "/assets/loading.riv",
    autoplay: true,
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <RiveComponent className="w-64 h-64" />
    </div>
  );
}