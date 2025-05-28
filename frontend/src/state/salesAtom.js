import { atomWithStorage } from "jotai/utils";

// List of paid orders
export const salesAtom = atomWithStorage("bar-pos-sales", []);