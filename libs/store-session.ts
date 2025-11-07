import { AppUser } from "@/types";
import * as SecureStore from "expo-secure-store";

const key = () => "user_session";

export const storeSession = async (session: AppUser): Promise<void> => {
  await SecureStore.setItemAsync(key(), JSON.stringify(session));
};

export const getSession = async (): Promise<AppUser | null> => {
  const session = await SecureStore.getItemAsync(key());
  return session ? JSON.parse(session) : null;
};

export const removeSession = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(key());
};
