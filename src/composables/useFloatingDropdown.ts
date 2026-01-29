import { computed, onMounted, onUnmounted, ref, type CSSProperties, type Ref } from "vue";

export interface FloatingDropdownPosition {
  top: number;
  left: number;
  width: number;
}

export interface UseFloatingDropdownOptions {
  offset?: number;
  zIndex?: number;
  closeOnOutsideClick?: boolean;
  outsideClickCapture?: boolean;
  repositionOnScroll?: boolean;
  repositionOnWheel?: boolean;
  repositionOnResize?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

const DEFAULT_Z_INDEX = 999999;

export function useFloatingDropdown(
  triggerRef: Ref<HTMLElement | null | undefined>,
  contentRef?: Ref<HTMLElement | null | undefined>,
  options: UseFloatingDropdownOptions = {},
) {
  const {
    offset = 4,
    zIndex = DEFAULT_Z_INDEX,
    closeOnOutsideClick = true,
    outsideClickCapture = true,
    repositionOnScroll = true,
    repositionOnWheel = true,
    repositionOnResize = true,
    onOpen,
    onClose,
  } = options;

  const isOpen = ref(false);
  const dropdownPosition = ref<FloatingDropdownPosition | null>(null);

  const updatePosition = () => {
    const rect = triggerRef.value?.getBoundingClientRect();
    if (!rect) return;

    dropdownPosition.value = {
      top: rect.bottom + offset,
      left: rect.left,
      width: rect.width,
    };
  };

  const open = () => {
    isOpen.value = true;
    updatePosition();
    onOpen?.();
  };

  const close = () => {
    isOpen.value = false;
    dropdownPosition.value = null;
    onClose?.();
  };

  const toggle = () => {
    isOpen.value ? close() : open();
  };

  const dropdownStyle = computed<CSSProperties>(() => ({
    position: "fixed",
    top: `${dropdownPosition.value?.top ?? 0}px`,
    left: `${dropdownPosition.value?.left ?? 0}px`,
    width: `${dropdownPosition.value?.width ?? 0}px`,
    zIndex,
  }));

  const isTargetInside = (target: EventTarget | null): boolean => {
    if (!(target instanceof Node)) return false;
    if (triggerRef.value?.contains(target)) return true;
    if (contentRef?.value?.contains(target)) return true;
    return false;
  };

  const handleDocumentClick = (event: MouseEvent) => {
    if (!closeOnOutsideClick || !isOpen.value) return;
    if (isTargetInside(event.target)) return;
    close();
  };

  const handleDocumentScroll = () => {
    if (!isOpen.value) return;
    updatePosition();
  };

  const handleWindowResize = () => {
    if (!isOpen.value) return;
    updatePosition();
  };

  onMounted(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    if (closeOnOutsideClick) {
      document.addEventListener("click", handleDocumentClick, outsideClickCapture);
    }

    if (repositionOnScroll) {
      document.addEventListener("scroll", handleDocumentScroll, true);
    }
    if (repositionOnWheel) {
      document.addEventListener("wheel", handleDocumentScroll, true);
    }
    if (repositionOnResize) {
      window.addEventListener("resize", handleWindowResize, { passive: true });
    }
  });

  onUnmounted(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    if (closeOnOutsideClick) {
      document.removeEventListener("click", handleDocumentClick, outsideClickCapture);
    }

    if (repositionOnScroll) {
      document.removeEventListener("scroll", handleDocumentScroll, true);
    }
    if (repositionOnWheel) {
      document.removeEventListener("wheel", handleDocumentScroll, true);
    }
    if (repositionOnResize) {
      window.removeEventListener("resize", handleWindowResize);
    }
  });

  return {
    isOpen,
    dropdownPosition,
    dropdownStyle,
    updatePosition,
    open,
    close,
    toggle,
  };
}
