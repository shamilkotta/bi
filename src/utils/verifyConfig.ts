import process from "process";
import { COLORS } from "./consts";
import { errorAndExit } from "./console";

export function checkSetup() {
  if (
    (!process.env.ZI_SETUP || process.env.ZI_SETUP != "1") &&
    process.argv[2] !== "setup"
  ) {
    errorAndExit(
      "zi not initialized.",
      `Run ${COLORS.bold}\`zi setup\`${COLORS.reset}${COLORS.yellow} and restart your shell.`
    );
  }
}
