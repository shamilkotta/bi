import process from "process";
import { COLORS, SYMBOLS } from "./consts";

export function checkSetup() {
  if (
    (!process.env.BI_SETUP || process.env.BI_SETUP != "1") &&
    process.argv[2] !== "setup"
  ) {
    console.error(
      `${COLORS.red}${SYMBOLS.warning} bi not initialized.${COLORS.reset}\n` +
        `${COLORS.yellow}Run ${COLORS.bold}\`bi setup\`${COLORS.reset}${COLORS.yellow} and restart your shell.${COLORS.reset}`
    );
    process.exit(1);
  }
}
