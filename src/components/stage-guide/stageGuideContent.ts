import { MessageSquareText, Mic2, ThumbsUp } from "@lucide/vue";
import type { AppConfig } from "@/stores/configStore";
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

/** "150" -> "2.5 min", "180" -> "3 min". */
function formatSetLength(seconds: number): string {
  const minutes = seconds / 60;
  const rounded = Math.round(minutes * 10) / 10;
  return `${rounded} min`;
}

/**
 * Build the stage guide cards from the streamer's exported stage config. All
 * thresholds, limits, tokens, and set length come from `config.json` so the
 * guide can never drift from the app; only the copy/structure lives here.
 */
export function buildStageGuideSections(stage: AppConfig["stage"]): StageGuideSection[] {
  const setLength = formatSetLength(stage.sessionSeconds);

  const heckleDetails = [
    `Cheer ${stage.heckleBits}+ bits with your message, or use the TTS redeem.`,
    `Cheer ${stage.vipHeckleBits}+ bits to send a VIP heckle.`,
    `Keep heckles to ${stage.heckleCharLimit} characters because longer heckles get trimmed.`,
  ];
  if (stage.heckleRedeemName) {
    heckleDetails.push(
      "No bits? Redeem Highlight My Message with your heckle text to send one too.",
    );
  }

  return [
    {
      id: "join-stage",
      title: "Get On Stage",
      threshold: `${stage.joinBits} bits`,
      theme: "primary",
      icon: Mic2,
      emotes: [emotes.scooting],
      commands: [
        {
          id: "join",
          label: "Queue command",
          text: `Cheer${stage.joinBits} ${stage.joinToken}`,
        },
      ],
      details: [
        "Koko pulls performers from the queue one at a time and posts in chat before your turn.",
        `Your chat messages are voiced by the puppet until your ${setLength} set ends or Koko boots you.`,
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
      threshold: `${stage.heckleBits}+ or ${stage.vipHeckleBits}+ bits`,
      theme: "secondary",
      icon: MessageSquareText,
      emotes: [emotes.aaaa],
      commands: [
        {
          id: "standard-heckle",
          label: "Standard heckle",
          text: `Cheer${stage.heckleBits} wrap it up`,
          threshold: `${stage.heckleBits}+ bits`,
        },
        {
          id: "vip-heckle",
          label: "VIP heckler",
          text: `Cheer${stage.vipHeckleBits} filthy fleepos`,
          threshold: `${stage.vipHeckleBits}+ bits`,
        },
      ],
      details: heckleDetails,
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
        { id: "vote-yay", label: "Yay vote", text: stage.voteYay },
        { id: "vote-boo", label: "Boo vote", text: stage.voteBoo },
      ],
      details: [
        `Type exactly ${stage.voteYay} or ${stage.voteBoo} while a performer is on stage.`,
        "Each person gets one active vote.",
        "Send the other word before the set ends to change your vote.",
      ],
      note: {
        title: "Exact words only",
        text: `Extra words or punctuation won't count. Send ${stage.voteYay} or ${stage.voteBoo} by itself.`,
      },
    },
  ];
}
