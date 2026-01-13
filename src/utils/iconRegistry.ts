import { type FunctionalComponent, h } from "vue";
import { Banana, Bot, Icon, Shell, Sun } from "lucide-vue-next";
import {
  coconut,
  crab,
  glassesSun,
  maskSnorkel,
  palmtreeIslandSun,
  surfboard,
  whale,
} from "@lucide/lab";

export type IconNode = any[];
export type IconComponent = FunctionalComponent<any> | IconNode;

const iconNodeComponentCache = new WeakMap<IconNode, FunctionalComponent<any>>();

export function createIconComponent(iconNode: IconNode): FunctionalComponent<any> {
  return (props: any) => {
    return h(Icon, {
      iconNode,
      size: props.size,
      width: props.width,
      height: props.height,
      ...props,
    });
  };
}

export function normalizeIcon(icon: IconComponent): FunctionalComponent<any> {
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
