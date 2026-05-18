import type { Models } from "appwrite";
import { account, ID } from "@/lib/appwrite/client";
import type { AuthUser, LoginInput, RegisterInput } from "@/types";

const toAuthUser = (
  user: Models.User<Models.Preferences>
): AuthUser => ({
  id: user.$id,
  name: user.name,
  email: user.email,
});

const normalizeError = (error: unknown) =>
  error instanceof Error ? error.message : "Terjadi kesalahan pada autentikasi.";

export const authService = {
  async getCurrentAccount() {
    try {
      const user = await account.get();
      return toAuthUser(user);
    } catch {
      return null;
    }
  },

  async register(input: RegisterInput) {
    try {
      const created = await account.create({
        userId: ID.unique(),
        email: input.email,
        password: input.password,
        name: input.username,
      });

      await account.createEmailPasswordSession({
        email: input.email,
        password: input.password,
      });

      return toAuthUser(created);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async login(input: LoginInput) {
    try {
      await account.createEmailPasswordSession({
        email: input.email,
        password: input.password,
      });
      const user = await account.get();
      return toAuthUser(user);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async logout() {
    try {
      await account.deleteSession({ sessionId: "current" });
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async updatePassword(password: string, oldPassword: string) {
    try {
      await account.updatePassword({
        password,
        oldPassword,
      });
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async listSessions() {
    try {
      const result = await account.listSessions();
      return result.sessions;
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async logoutSession(sessionId: string) {
    try {
      await account.deleteSession({ sessionId });
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async logoutAllSessions() {
    try {
      await account.deleteSessions();
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },
};
