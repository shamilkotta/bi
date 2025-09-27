import fs from "fs";
import path from "path";
import os from "os";
import AnimatedText from "./utils/animatedText";
import { getConfig } from "./utils/getConfig";
import { generateAiResponse } from "./lib/ai";
import { COLORS } from "./utils/consts";
import { log } from "./utils/console";

export default async function ziHelp(_: any, options: any) {
  const { prompt, model, skip } = options.opts();
  const home = os.homedir();
  const config = getConfig();

  const modelName = model || config.model;
  const apiKey = config.apiKey;

  log(`${COLORS.base}Model - ${modelName}${COLORS.reset}`);
  const animatedText = new AnimatedText("Thinking");
  animatedText.start();

  let history = [];
  const historyFile = path.join(
    home,
    `.zi/logs/history_${process.env.ZI_SESSION_ID}`
  );
  if (!skip) {
    let rawHistory;

    if (!fs.existsSync(historyFile)) {
      rawHistory = "";
    } else {
      rawHistory = fs.readFileSync(historyFile, "utf8");
    }

    history = rawHistory
      .trim()
      .split("--END--")
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  }

  const response = await generateAiResponse({
    prompt,
    model: modelName,
    apiKey,
    history: history,
    onStart: () => {
      animatedText.stop();
    }
  });

  if (response) {
    const cmd = {
      timestamp: new Date().toISOString(),
      command: "zi -p " + (prompt ?? ""),
      exit_code: 0,
      output: response
    };

    fs.appendFileSync(
      historyFile,
      JSON.stringify(cmd, null, 2) + "\n--END--\n",
      "utf8"
    );
  }

  process.exit(0);
}
