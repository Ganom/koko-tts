import { describe, expect, it } from "vitest";
import { FALLBACK_CONFIG } from "@/stores/configStore";
import { buildStageGuideSections } from "../stageGuideContent";

const stage = FALLBACK_CONFIG.stage;

const findSection = (id: string, override = stage) => {
  const section = buildStageGuideSections(override).find((s) => s.id === id);
  if (!section) throw new Error(`missing section ${id}`);
  return section;
};

describe("buildStageGuideSections", () => {
  it("drives the join card from config", () => {
    const join = findSection("join-stage");
    expect(join.threshold).toBe("500 bits");
    expect(join.commands[0].text).toBe("Cheer500 !join");
  });

  it("renders the set length from sessionSeconds", () => {
    expect(findSection("join-stage").details.some((d) => d.includes("2.5 min"))).toBe(true);
    const longer = findSection("join-stage", { ...stage, sessionSeconds: 180 });
    expect(longer.details.some((d) => d.includes("3 min"))).toBe(true);
  });

  it("uses 'VIP heckler' (not 'VIP dandy') and config heckle values", () => {
    const heckle = findSection("send-heckle");
    const vip = heckle.commands.find((c) => c.id === "vip-heckle");
    expect(vip?.label).toBe("VIP heckler");
    expect(vip?.text).toBe("Cheer1000 filthy fleepos");

    const joined = [vip?.label, ...heckle.details].join(" ");
    expect(joined.toLowerCase()).not.toContain("vip dandy");
    expect(heckle.details.some((d) => d.includes("100 characters"))).toBe(true);
  });

  it("adds a heckle-via-redeem note only when a redeem is configured", () => {
    const withRedeem = findSection("send-heckle");
    expect(withRedeem.details.some((d) => d.includes("Highlight My Message"))).toBe(true);

    const withoutRedeem = findSection("send-heckle", { ...stage, heckleRedeemName: "" });
    expect(withoutRedeem.details.some((d) => d.includes("Highlight My Message"))).toBe(false);
  });

  it("rewords the vote note away from 'vote parser'", () => {
    const vote = findSection("vote-performer");
    expect(vote.note.text).toContain("won't count");
    expect(vote.note.text.toLowerCase()).not.toContain("vote parser");
    expect(vote.commands.map((c) => c.text)).toEqual(["Yay", "Boo"]);
  });
});
