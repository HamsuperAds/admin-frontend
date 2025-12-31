import { defineStore } from "pinia";
import type { User } from "@/types/user";

export const useAppResourceInfoStore = defineStore("appResourceInfoStore", {
  state: () => ({
    userName: "Donzoby",
    users: [] as User[],
  }),
  getters: {},
  actions: {},
});
