/** Ignore play() rejections when load/src changes or autoplay is blocked. */
export function safePlay(video: HTMLVideoElement | null | undefined) {
  if (!video || !video.paused) return;

  const promise = video.play();
  if (promise === undefined) return;

  void promise.catch((error: unknown) => {
    if (error instanceof DOMException) {
      if (error.name === "AbortError" || error.name === "NotAllowedError") return;
    }
    console.warn("Video play failed:", error);
  });
}
