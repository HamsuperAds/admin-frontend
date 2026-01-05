import { defineStore } from "pinia";
import type { User } from "@/types/user";
import type { Category, Subcategory } from "@/types/category";

export const useAppResourceInfoStore = defineStore("appResourceInfoStore", {
  state: () => ({
    userName: "Donzoby",
    users: [] as User[],
    categories: [] as Category[],
    subcategories: [] as Subcategory[],
  }),
  getters: {},
  actions: {},
});
