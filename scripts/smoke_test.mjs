import { spawn } from "node:child_process";
import { once } from "node:events";
import process from "node:process";
import { setTimeout as delay } from "node:timers/promises";

const PORT = Number(process.env.SMOKE_TEST_PORT ?? "31337");
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function fetchWithRetry(path, { timeoutMs, intervalMs }) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        headers: { Accept: "text/html" },
      });
      return response;
    } catch {
      await delay(intervalMs);
    }
  }

  throw new Error(`Timed out waiting for ${path} at ${BASE_URL}`);
}

async function assertPage(path, { mustContain }) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { Accept: "text/html" },
  });

  if (!response.ok) {
    throw new Error(`GET ${path} failed: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  for (const fragment of mustContain) {
    if (!html.includes(fragment)) {
      throw new Error(`GET ${path} missing expected text: ${JSON.stringify(fragment)}`);
    }
  }
}

function run(command, args, { env }) {
  return spawn(command, args, {
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
}

async function stopProcess(childProcess, exitPromise) {
  if (!childProcess.killed) childProcess.kill("SIGTERM");

  const didExit = await Promise.race([
    exitPromise.then(() => true),
    delay(5_000).then(() => false),
  ]);

  if (!didExit) {
    childProcess.kill("SIGKILL");
    await exitPromise;
  }
}

async function main() {
  const server = run("npm", ["run", "start", "--", "-p", String(PORT)], {
    env: { PORT: String(PORT) },
  });
  const serverExit = once(server, "exit");

  try {
    process.on("SIGINT", () => {
      server.kill("SIGTERM");
      process.exit(130);
    });
    process.on("SIGTERM", () => {
      server.kill("SIGTERM");
      process.exit(143);
    });

    await fetchWithRetry("/", { timeoutMs: 30_000, intervalMs: 250 });

    await assertPage("/", { mustContain: ["John Doe", "Professional experience"] });
    await assertPage("/membership-grades", {
      mustContain: ["Membership grades", "Senior Member"],
    });
    await assertPage("/login", { mustContain: ["Sign in"] });
    await assertPage("/account", { mustContain: ["Account"] });
    await assertPage("/membership/apply", {
      mustContain: ["Membership upgrade application"],
    });
    await assertPage("/profile/edit", { mustContain: ["Edit profile"] });
    await assertPage("/articles", { mustContain: ["Articles"] });
    await assertPage("/articles/new", { mustContain: ["New article"] });
  } finally {
    await stopProcess(server, serverExit);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
