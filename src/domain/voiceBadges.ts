import type { Voice } from "@/types/voice";

/** How long a voice wears the "NEW" badge. Presentation policy, not streamer config. */
export const NEW_VOICE_WINDOW_DAYS = 14;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * A voice is "new" when its export timestamp is within `windowDays` of `now`.
 * Absent, unparseable, or future-dated timestamps are treated as not new so a
 * missing/garbled value never surfaces as a badge.
 */
export function isNewVoice(
  addedAt: string | undefined,
  now: Date,
  windowDays: number = NEW_VOICE_WINDOW_DAYS,
): boolean {
  if (!addedAt) return false;

  const added = new Date(addedAt).getTime();
  if (Number.isNaN(added)) return false;

  const ageMs = now.getTime() - added;
  if (ageMs < 0) return false;

  return ageMs <= windowDays * MS_PER_DAY;
}

/**
 * Order voices for the carousel: new voices first (newest first), then the
 * existing cost-descending, name-ascending order. Returns a new array.
 */
export function orderVoicesNewFirst(voices: Voice[], now: Date): Voice[] {
  return [...voices].sort((a, b) => {
    const aNew = isNewVoice(a.addedAt, now);
    const bNew = isNewVoice(b.addedAt, now);

    if (aNew !== bNew) return aNew ? -1 : 1;

    if (aNew && bNew) {
      const aTime = new Date(a.addedAt as string).getTime();
      const bTime = new Date(b.addedAt as string).getTime();
      if (aTime !== bTime) return bTime - aTime;
    }

    const costDiff = b.cost - a.cost;
    if (costDiff !== 0) return costDiff;

    return a.name.localeCompare(b.name);
  });
}
