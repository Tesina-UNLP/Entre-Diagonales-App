import { spawnSync } from "node:child_process";

const requiredEnvironment = [
  "POSTHOG_CLI_API_KEY",
  "POSTHOG_CLI_PROJECT_ID",
  "POSTHOG_CLI_HOST",
];
const missing = requiredEnvironment.filter((name) => !process.env[name]);

if (missing.length > 0) {
  console.error(
    `Faltan secretos para subir source maps: ${missing.join(", ")}`,
  );
  process.exit(1);
}

const update = spawnSync(
  "eas",
  ["update", "--output-dir", "dist", ...process.argv.slice(2)],
  { stdio: "inherit" },
);

if (update.status !== 0) {
  process.exit(update.status ?? 1);
}

const upload = spawnSync(
  "posthog-cli",
  ["hermes", "upload", "--directory", "dist", "--skip-on-conflict"],
  { stdio: "inherit" },
);

process.exit(upload.status ?? 1);
