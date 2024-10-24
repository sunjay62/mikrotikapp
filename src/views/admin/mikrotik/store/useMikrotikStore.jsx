import { create } from "zustand";

const useMikrotikStore = create((set) => ({
  mikrotikIdList: null,
  setMikrotikIdList: (mikrotikIdList) => set({ mikrotikIdList }),
}));

export default useMikrotikStore;
