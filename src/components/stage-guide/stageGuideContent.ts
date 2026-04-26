import { MessageSquareText, Mic2, ThumbsUp } from "@lucide/vue";
import type { StageGuideEmote, StageGuideSection } from "./types";

const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
const emotePath = (filename: string) => `${baseUrl}/stage-emotes/${filename}`;

const emotes = {
  scooting: {
    src: emotePath("scooting.webp"),
    alt: "Scooting emote",
  },
  aaaa: {
    src: emotePath("aaaa.webp"),
    alt: "AAAA emote",
  },
  yay: {
    src: emotePath("yay.webp"),
    alt: "Yay emote",
  },
  boo: {
    src: emotePath("boo.webp"),
    alt: "Boo emote",
  },
} satisfies Record<string, StageGuideEmote>;

export const stageGuideSections: StageGuideSection[] = [
  {
    id: "join-stage",
    title: "Get On Stage",
    threshold: "500 bits",
    theme: "primary",
    icon: Mic2,
    emotes: [emotes.scooting],
    commands: [
      {
        id: "join",
        label: "Queue command",
        text: "Cheer500 !join",
      },
    ],
    details: [
      "Koko pulls performers from the queue one at a time and posts in chat before your turn.",
      "Your chat messages are voiced by the puppet until your 2.5 min set ends or Koko boots you.",
      "Use any voice that is not a priority voice. Without a voice, it uses your default.",
    ],
    note: {
      title: "Keep the set tight",
      text: "Avoid v3 unless the message is short or it genuinely improves the bit.",
    },
  },
  {
    id: "send-heckle",
    title: "Send a Heckle",
    threshold: "100+ or 1000+ bits",
    theme: "secondary",
    icon: MessageSquareText,
    emotes: [emotes.aaaa],
    commands: [
      {
        id: "standard-heckle",
        label: "Standard heckle",
        text: "Cheer100 wrap it up",
        threshold: "100+ bits",
      },
      {
        id: "vip-heckle",
        label: "VIP dandy heckle",
        text: "Cheer1000 filthy fleepos",
        threshold: "1000+ bits",
      },
    ],
    details: [
      "Cheer 100+ bits with your message, or use the TTS redeem.",
      "Cheer 1000+ bits to speak as the VIP dandy.",
      "Keep heckles to 100 characters because longer heckles get trimmed.",
    ],
    note: {
      title: "Important",
      text: "Do not include !join in a heckle. Any message with !join is treated as a stage join.",
    },
  },
  {
    id: "vote-performer",
    title: "Vote",
    threshold: "Chat vote",
    theme: "accent",
    icon: ThumbsUp,
    emotes: [emotes.yay, emotes.boo],
    commands: [
      { id: "vote-yay", label: "Yay vote", text: "Yay" },
      { id: "vote-boo", label: "Boo vote", text: "Boo" },
    ],
    details: [
      "Type exactly Yay or Boo while a performer is on stage.",
      "Each person gets one active vote.",
      "Send the other word before the set ends to change your vote.",
    ],
    note: {
      title: "Exact words only",
      text: "Extra words or punctuation can miss the vote parser. Send Yay or Boo by itself.",
    },
  },
];
