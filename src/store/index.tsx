import { Store } from "tauri-plugin-store-api";
import { ThemeType } from "../App";

const store = new Store(".settings.dat");

export async function setThemeStore(themeVal: ThemeType) {
  await store.set("theme", themeVal);
  await store.save();
}

export async function getThemeStore(): Promise<string | null> {
  return await store.get("theme");
}

// await store.save(); // this manually saves the store, otherwise the store is only saved when your app is closed
