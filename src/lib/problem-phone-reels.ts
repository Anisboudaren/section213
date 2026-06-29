import {
  SCROLL_VIDEO_1,
  SCROLL_VIDEO_2,
  SCROLL_VIDEO_3,
} from "@/lib/hero-video-sources";

export type ProblemPhoneReel = {
  src: string;
  likes: string;
  comments: string;
  shares: string;
  saves: string;
  sound: string;
};

export const PROBLEM_PHONE_REELS: ProblemPhoneReel[] = [
  {
    src: SCROLL_VIDEO_1,
    likes: "48.2K",
    comments: "1,204",
    shares: "3.8K",
    saves: "9.1K",
    sound: "Original Sound — Section 213",
  },
  {
    src: SCROLL_VIDEO_2,
    likes: "112K",
    comments: "2,891",
    shares: "8.4K",
    saves: "21K",
    sound: "Trending Audio — Section 213",
  },
  {
    src: SCROLL_VIDEO_3,
    likes: "76.5K",
    comments: "1,672",
    shares: "5.2K",
    saves: "14.3K",
    sound: "Viral Mix — Section 213",
  },
];
