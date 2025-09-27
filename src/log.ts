import os from "os";
import fs from "fs";
import path from "path";
import { errorAndExit, log as consoleLog } from "./utils/console";
import { COLORS } from "./utils/consts";

export default function log() {
  const sessionId = process.env.ZI_SESSION_ID;
  const home = os.homedir();

  if (!sessionId) {
    errorAndExit("No session found.");
  }

  const historyFile = path.join(home, `.zi/logs/history_${sessionId}`);

  const rawHistory = fs.readFileSync(historyFile, "utf8");

  const history = rawHistory
    .trim()
    .split("--END--")
    .filter(Boolean)
    .map((line) => JSON.parse(line));

  console.log(history.slice(-5));
  if (history.length > 5)
    consoleLog(`${COLORS.blue} +${history.length - 5} more...${COLORS.reset}`);

  process.exit(0);
}
