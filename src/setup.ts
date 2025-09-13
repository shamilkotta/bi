import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import { COLORS, SYMBOLS } from "./utils/consts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function setupShell(_: any, options: any) {
  const { shell } = options.opts();
  const home = os.homedir();

  const defaultShell =
    shell || process.env.SHELL?.includes("zsh") ? "zsh" : "bash";

  const rcFile =
    defaultShell === "zsh"
      ? path.join(home, ".zshrc")
      : path.join(home, ".bashrc");

  let source = path.join(__dirname, `./shell/${defaultShell}`);
  source = source.replace(home, "$HOME");

  const markerStart = "# >>> BI >>>";
  const markerEnd = "# <<< BI <<<";
  const sourceLine = `[ -f "${source}" ] && source "${source}"`;

  const rcContent = fs.existsSync(rcFile)
    ? fs.readFileSync(rcFile, "utf8")
    : "";

  if (!rcContent.includes(sourceLine)) {
    const updated = `${rcContent.trim()}\n\n${markerStart}\n${sourceLine}\n${markerEnd}\n`;
    fs.writeFileSync(rcFile, updated, "utf8");

    console.log(
      `${COLORS.green}${SYMBOLS.tick} Successfully configured in ${COLORS.bold}${rcFile}${COLORS.reset}`
    );

    console.log(
      `${COLORS.yellow}${SYMBOLS.pointer} Please restart your terminal or run \`${COLORS.bold}source ${rcFile}\` to apply changes.${COLORS.reset}`
    );
  } else {
    console.log(
      `${COLORS.blue}${SYMBOLS.info} BI is already configured in ${COLORS.bold}${rcFile}${COLORS.reset}`
    );
  }

  console.log(
    `${COLORS.magenta}\n${SYMBOLS.star} Setup completed! ${SYMBOLS.star}${COLORS.reset}\n`
  );
}
