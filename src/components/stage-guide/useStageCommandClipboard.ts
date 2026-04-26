import { onUnmounted, ref } from "vue";
import type { StageGuideCommand } from "./types";

const fallbackCopy = (text: string) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  const didCopy = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!didCopy) {
    throw new Error("Copy command failed");
  }
};

const writeClipboard = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  fallbackCopy(text);
};

export const useStageCommandClipboard = () => {
  const copiedCommandId = ref<string | null>(null);
  let resetCopiedTimer: number | undefined;

  const clearResetTimer = () => {
    if (resetCopiedTimer !== undefined) {
      window.clearTimeout(resetCopiedTimer);
      resetCopiedTimer = undefined;
    }
  };

  const copyCommand = async (command: StageGuideCommand) => {
    await writeClipboard(command.copyText ?? command.text);
    copiedCommandId.value = command.id;

    clearResetTimer();

    resetCopiedTimer = window.setTimeout(() => {
      if (copiedCommandId.value === command.id) {
        copiedCommandId.value = null;
      }
    }, 1600);
  };

  onUnmounted(clearResetTimer);

  return {
    copiedCommandId,
    copyCommand,
  };
};
