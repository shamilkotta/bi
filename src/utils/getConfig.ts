import path from "path";
import os from "os";
import fs from "fs";
import { COLORS } from "./consts";
import { errorAndExit } from "./console";

export const getConfig = () => {
  const home = os.homedir();
  const configFile = path.join(home, ".zi/config.json");

  if (!fs.existsSync(configFile)) {
    errorAndExit(
      `Configuration file not found` +
        `Run ${COLORS.bold}\`zi setup\`${COLORS.reset}${COLORS.yellow} and restart your shell`
    );
  }

  return JSON.parse(fs.readFileSync(configFile, "utf8"));
};
