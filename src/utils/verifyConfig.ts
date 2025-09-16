import process from "process";
import { COLORS } from "./consts";
import { errorAndExit } from "./console";

export function checkSetup() {
  if (
    (!process.env.BI_SETUP || process.env.BI_SETUP != "1") &&
    process.argv[2] !== "setup"
  ) {
    errorAndExit(
      "bi not initialized.",
      `Run ${COLORS.bold}\`bi setup\`${COLORS.reset}${COLORS.yellow} and restart your shell.`
    );
  }
}
