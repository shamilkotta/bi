import os from "os";
import fs from "fs";
import path from "path";

export default function writeError(error: any, sessionId: string) {
  const home = os.homedir();
  const errorLogDir = path.join(home, ".zi", "error-logs");
  if (!fs.existsSync(errorLogDir)) {
    fs.mkdirSync(errorLogDir, { recursive: true });
  }
  const errorLogFile = path.join(errorLogDir, `error_${sessionId}.log`);
  const parsedError = JSON.stringify(
    error,
    Object.getOwnPropertyNames(error),
    2
  );
  fs.writeFileSync(errorLogFile, parsedError, "utf8");

  return errorLogFile;
}
