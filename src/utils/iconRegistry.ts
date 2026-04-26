import { h } from "vue";
import {
  Banana,
  Bot,
  Icon,
  Shell,
  Sun,
  type IconNode,
  type LucideIcon,
  type LucideProps,
} from "@lucide/vue";
import {
  coconut,
  crab,
  glassesSun,
  maskSnorkel,
  palmtreeIslandSun,
  surfboard,
  whale,
} from "@lucide/lab";

export type { IconNode };
export type IconComponent = LucideIcon | IconNode;

const iconNodeComponentCache = new WeakMap<IconNode, LucideIcon>();

export function createIconComponent(iconNode: IconNode): LucideIcon {
  return (props: LucideProps) => {
    return h(Icon, {
      name: "",
      iconNode,
      ...props,
    });
  };
}

export function normalizeIcon(icon: IconComponent): LucideIcon {
  if (typeof icon === "function") {
    return icon;
  }

  const cached = iconNodeComponentCache.get(icon);
  if (cached) return cached;

  const component = createIconComponent(icon);
  iconNodeComponentCache.set(icon, component);
  return component;
}

export const tropicalIcons = [coconut, palmtreeIslandSun, Shell, whale, Sun, glassesSun, surfboard];

export const monkeyIcons = [
  Bot,
  Banana,
  coconut,
  glassesSun,
  maskSnorkel,
  palmtreeIslandSun,
  crab,
  Sun,
];
