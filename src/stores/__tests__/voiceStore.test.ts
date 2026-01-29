import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useVoiceStore } from "@/stores/voiceStore";

describe("voiceStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("does not mutate filteredVoices when computing sortedVoices", () => {
    const store = useVoiceStore();

    store.voices = [
      { name: "zed", text: "a", cost: 300 },
      { name: "alpha", text: "b", cost: 500 },
      { name: "limited", text: "c", cost: 100, limited: true },
    ];
    store.searchQuery = "";

    const filtered = store.filteredVoices;
    expect(filtered.map((v) => v.name)).toEqual(["zed", "alpha", "limited"]);

    const sorted = store.sortedVoices;
    expect(sorted.map((v) => v.name)).toEqual(["limited", "alpha", "zed"]);

    // The filtered array should remain in original order and not be re-used for sorting.
    expect(filtered.map((v) => v.name)).toEqual(["zed", "alpha", "limited"]);
    expect(sorted).not.toBe(filtered);
  });
});

