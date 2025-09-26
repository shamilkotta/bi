import path from "path";
import os from "os";
import fs from "fs";
import { COLORS } from "./consts";
import { errorAndExit } from "./console";

export const getConfig = () => {
  const home = os.homedir();
  const configFile = path.join(home, ".bi/config.json");

  if (!fs.existsSync(configFile)) {
    errorAndExit(
      `Configuration file not found` +
        `Run ${COLORS.bold}\`bi setup\`${COLORS.reset}${COLORS.yellow} and restart your shell`
    );
  }

  return JSON.parse(fs.readFileSync(configFile, "utf8"));
};
