import { ChangeEvent, useMemo } from "react";

type onTypeCallback = (value: string) => void;

interface callbacks {
  onTypeStart?: onTypeCallback;
  onTypeFinish?: onTypeCallback;
  onChange?: (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
}

let LOCK = false;
let TIMEOUT_CACHE: NodeJS.Timeout | number;

export function createOnTypeHandler(callbacks: callbacks, delay?: number) {
  return {
    onChange: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      callbacks?.onChange(event);
      if (!LOCK) {
        LOCK = true;
        callbacks?.onTypeStart(event.target.value);
      }

      TIMEOUT_CACHE && clearTimeout(TIMEOUT_CACHE as NodeJS.Timeout);
      let cache = event.target.value;

      TIMEOUT_CACHE = setTimeout(() => {
        callbacks?.onTypeFinish(cache);
        LOCK = false;
      }, delay || 1000);
    },
  };
}

export function useonType(callbacks: callbacks, delay?: number) {
  return useMemo(() => {
    return createOnTypeHandler(callbacks, delay);
  }, [callbacks, delay]);
}
