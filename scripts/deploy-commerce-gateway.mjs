import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const tarPath =
  process.argv[2] || "C:/tmp/commerce-gateway.tar.gz";

const functionId = "commerce-gateway";
const functionName = "CardToo Commerce Gateway";

const readEnvFile = async () => {
  const raw = await readFile(".env.local", "utf8");
  return raw
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((line) => !line.trim().startsWith("/*"))
    .reduce((acc, line) => {
      const index = line.indexOf("=");
      if (index === -1) return acc;
      acc[line.slice(0, index).trim()] = line.slice(index + 1).trim();
      return acc;
    }, {});
};

const appwriteFetch = async (endpoint, projectId, apiKey, path, init = {}) => {
  const response = await fetch(`${endpoint}${path}`, {
    ...init,
    headers: {
      "X-Appwrite-Project": projectId,
      "X-Appwrite-Key": apiKey,
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status} ${response.statusText}: ${text}`);
  }

  return response;
};

const ensureFunction = async ({ endpoint, projectId, apiKey }) => {
  const getResponse = await fetch(`${endpoint}/functions/${functionId}`, {
    headers: {
      "X-Appwrite-Project": projectId,
      "X-Appwrite-Key": apiKey,
    },
  });

  const body = {
    functionId,
    name: functionName,
    runtime: "node-22",
    execute: ["users"],
    events: [],
    schedule: "",
    timeout: 30,
    enabled: true,
    logging: true,
    entrypoint: "src/main.js",
    commands: "npm install",
    scopes: [
      "rows.read",
      "rows.write",
      "files.read",
      "files.write",
      "users.read",
      "users.write",
    ],
  };

  if (getResponse.ok) {
    await appwriteFetch(endpoint, projectId, apiKey, `/functions/${functionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return;
  }

  if (getResponse.status !== 404) {
    throw new Error(await getResponse.text());
  }

  await appwriteFetch(endpoint, projectId, apiKey, "/functions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

const uploadDeployment = async ({ endpoint, projectId, apiKey }) => {
  const fileBuffer = await readFile(tarPath);
  const file = new File([fileBuffer], "commerce-gateway.tar.gz", {
    type: "application/gzip",
  });
  const form = new FormData();
  form.set("activate", "true");
  form.set("entrypoint", "src/main.js");
  form.set("commands", "npm install");
  form.set("code", file);

  await appwriteFetch(
    endpoint,
    projectId,
    apiKey,
    `/functions/${functionId}/deployments`,
    {
      method: "POST",
      body: form,
    }
  );
};

const main = async () => {
  if (!existsSync(tarPath)) {
    throw new Error(`Deployment package not found: ${tarPath}`);
  }

  const env = await readEnvFile();
  const endpoint = env.APPWRITE_ENDPOINT;
  const projectId = env.APPWRITE_PROJECT_ID;
  const apiKey = env.APPWRITE_API_KEY;

  if (!endpoint || !projectId || !apiKey) {
    throw new Error("Missing APPWRITE_ENDPOINT / APPWRITE_PROJECT_ID / APPWRITE_API_KEY.");
  }

  await ensureFunction({ endpoint, projectId, apiKey });
  await uploadDeployment({ endpoint, projectId, apiKey });

  console.log("commerce-gateway function ensured and deployment uploaded.");
};

await main();
