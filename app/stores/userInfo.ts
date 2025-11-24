import { defineStore } from "pinia";

export const useUserInfoStore = defineStore("userInfoStore", {
  state: () => ({
    userName: "Donzoby User",
  }),
  getters: {},
  actions: {},
});
