import { COLORS, SYMBOLS } from "./consts";

export const error = (message: string, info?: string) => {
  let out = `${COLORS.red}${SYMBOLS.warning} ${message}${COLORS.reset}`;
  if (info) {
    out += `\n${COLORS.yellow}${info}${COLORS.reset}`;
  }
  console.error(out);
};

export const errorAndExit = (message: string, info?: string) => {
  error(message, info);
  process.exit(1);
};

export const success = (message: string) => {
  console.log(`${COLORS.green}${SYMBOLS.tick} ${message}${COLORS.reset}`);
};

export const info = (message: string) => {
  console.log(`${COLORS.blue}${SYMBOLS.info} ${message}${COLORS.reset}`);
};

export const warn = (message: string) => {
  console.log(`${COLORS.yellow}${SYMBOLS.pointer} ${message}${COLORS.reset}`);
};

export const log = (...args: any[]) => {
  console.log(...args);
};
