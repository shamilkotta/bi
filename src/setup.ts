import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import { COLORS, SYMBOLS } from "./utils/consts";
import { errorAndExit, info, log, success, warn } from "./utils/console";
import readline from "readline/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export default async function setupShell(_: any, options: any) {
  let { apiKey, model } = options.opts();
  const { shell } = options.opts();
  const home = os.homedir();

  if (!apiKey) {
    const answer = await rl.question(
      `${COLORS.bold}Enter your API key:${COLORS.reset} `
    );

    if (!answer.trim()) {
      errorAndExit("No API key provided.");
    }
    apiKey = answer.trim();
  }

  if (!model) {
    const answer = await rl.question(
      `${COLORS.bold}Enter model name${COLORS.reset} ` +
        `${COLORS.base}${COLORS.italic}(https://vercel.com/ai-gateway/models)${COLORS.reset}` +
        `${COLORS.bold}:${COLORS.reset} `
    );

    if (!answer.trim()) {
      errorAndExit("No model provided.");
    }
    model = answer.trim();
  }

  const config = path.join(home, ".zi/config.json");
  fs.writeFileSync(config, JSON.stringify({ apiKey, model }, null, 2));

  const defaultShell =
    shell || process.env.SHELL?.includes("zsh") ? "zsh" : "bash";

  if (defaultShell !== "zsh") {
    errorAndExit("Only zsh is supported at the moment.");
  }

  const rcFile =
    defaultShell === "zsh"
      ? path.join(home, ".zshrc")
      : path.join(home, ".bashrc");

  let source = path.join(__dirname, `./shell/${defaultShell}.sh`);
  source = source.replace(home, "$HOME");

  const markerStart = "# >>> ZI >>>";
  const markerEnd = "# <<< ZI <<<";
  const sourceLine = `[ -f "${source}" ] && source "${source}"`;

  const rcContent = fs.existsSync(rcFile)
    ? fs.readFileSync(rcFile, "utf8")
    : "";

  if (!rcContent.includes(sourceLine)) {
    const updated = `${rcContent.trim()}\n\n${markerStart}\n${sourceLine}\n${markerEnd}\n`;
    fs.writeFileSync(rcFile, updated, "utf8");

    success(`Successfully configured in ${COLORS.bold}${rcFile}`);
    warn(
      `Please restart your terminal or run \`${COLORS.bold}source ${rcFile}\` to apply changes.`
    );
  } else {
    info(`zi is already configured in ${COLORS.bold}${rcFile}`);
  }

  log(
    `${COLORS.magenta}\n${SYMBOLS.star} Setup completed! ${SYMBOLS.star}${COLORS.reset}\n`
  );
  process.exit(0);
}
