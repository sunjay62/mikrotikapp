import { create } from "zustand";

const useSiteStore = create((set) => ({
  siteIdList: null,
  setSiteIdList: (siteIdList) => set({ siteIdList }),
}));

export default useSiteStore;
