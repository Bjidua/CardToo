import {
  Account,
  Client,
  ID,
  Permission,
  Query,
  Role,
  Storage,
  TablesDB,
} from "appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

export const appwriteClient = client;
export const account = new Account(client);
export const tablesDB = new TablesDB(client);
export const storage = new Storage(client);
export { ID, Permission, Query, Role };
