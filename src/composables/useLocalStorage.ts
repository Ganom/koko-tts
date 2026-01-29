import { type Ref, ref } from "vue";

export function useLocalStorage<T>(key: string, defaultValue: T): [Ref<T>, (value: T) => void] {
  const readStoredValue = (): T => {
    if (typeof window === "undefined") return defaultValue;

    try {
      const storedValue = window.localStorage.getItem(key);
      if (storedValue === null) return defaultValue;
      return JSON.parse(storedValue) as T;
    } catch {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // ignore
      }
      return defaultValue;
    }
  };

  const state = ref(readStoredValue()) as Ref<T>;

  const setValue = (value: T) => {
    state.value = value;
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  };

  return [state, setValue];
}
