import fs from "fs";
import path from "path";
import os from "os";
import AnimatedText from "./utils/animatedText";
import { getConfig } from "./utils/getConfig";
import { generateAiResponse } from "./lib/ai";
import { COLORS } from "./utils/consts";
import { log } from "./utils/console";

export default function biHelp(_: any, options: any) {
  const { prompt, model, skip } = options.opts();
  const home = os.homedir();
  const config = getConfig();

  const modelName = model || config.model;
  const apiKey = config.apiKey;

  log(`${COLORS.base}Model - ${modelName}${COLORS.reset}`);
  const animatedText = new AnimatedText("Thinking");
  animatedText.start();

  let history = [];

  if (!skip) {
    const historyFile = path.join(
      home,
      `.bi/logs/history_${process.env.BI_SESSION_ID}`
    );
    const rawHistory = fs.readFileSync(historyFile, "utf8");

    history = rawHistory
      .trim()
      .split("--END--")
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  }

  generateAiResponse({
    prompt,
    model: modelName,
    apiKey,
    history: history,
    onStart: () => {
      animatedText.stop();
    }
  }).then(() => {
    process.exit(0);
  });
}
