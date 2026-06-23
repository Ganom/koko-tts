import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useVoiceStore } from "@/stores/voiceStore";

describe("voiceStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("sorts by cost descending then name without mutating filteredVoices", () => {
    const store = useVoiceStore();

    store.voices = [
      { name: "zed", text: "a", cost: 300 },
      { name: "alpha", text: "b", cost: 500 },
      { name: "gamma", text: "c", cost: 100 },
    ];
    store.searchQuery = "";

    const filtered = store.filteredVoices;
    expect(filtered.map((v) => v.name)).toEqual(["zed", "alpha", "gamma"]);

    const sorted = store.sortedVoices;
    expect(sorted.map((v) => v.name)).toEqual(["alpha", "zed", "gamma"]);

    // The filtered array should remain in original order and not be re-used for sorting.
    expect(filtered.map((v) => v.name)).toEqual(["zed", "alpha", "gamma"]);
    expect(sorted).not.toBe(filtered);
  });

  it("orders new voices to the front, newest first", () => {
    const store = useVoiceStore();

    const recent = new Date(Date.now() - 60_000).toISOString(); // 1 min ago
    const olderNew = new Date(Date.now() - 3_600_000).toISOString(); // 1 hr ago
    const ancient = new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(); // 60 days ago

    store.voices = [
      { name: "zed", text: "a", cost: 300, addedAt: ancient },
      { name: "alpha", text: "b", cost: 500 },
      { name: "gamma", text: "c", cost: 100, addedAt: recent },
      { name: "beta", text: "d", cost: 200, addedAt: olderNew },
    ];
    store.searchQuery = "";

    expect(store.sortedVoices.map((v) => v.name)).toEqual(["gamma", "beta", "alpha", "zed"]);
  });
});
