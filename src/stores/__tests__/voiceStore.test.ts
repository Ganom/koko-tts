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
});
