// store/useGlobalLoader.ts
import { create } from "zustand";

type TGlobalLoaderState = {
  showLoader: boolean;
  setShowLoader: (val: boolean) => void;
};

export const useGlobalLoader = create<TGlobalLoaderState>((set) => ({
  showLoader: false,
  setShowLoader: (val) => set(() => ({ showLoader: val })),
}));
