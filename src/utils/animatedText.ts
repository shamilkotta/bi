import { COLORS } from "./consts";

export default class AnimatedText {
  private text: string;
  private baseColor = COLORS.base;
  private highlightColor = COLORS.highlight;
  private reset = COLORS.reset;
  private offset = 0;
  private controller: NodeJS.Timeout | null = null;

  constructor(text: string) {
    this.text = text;
  }

  private animate() {
    let out = this.text;
    const newChar =
      this.highlightColor + this.text[this.offset] + this.baseColor;
    out =
      out.substring(0, this.offset) + newChar + out.substring(this.offset + 1);

    this.offset = (this.offset + 1) % this.text.length;

    process.stdout.write("\r" + this.baseColor + out + this.reset);
  }

  start() {
    this.controller = setInterval(() => this.animate(), 70);
  }

  stop() {
    if (!this.controller) return;
    clearInterval(this.controller);
    process.stdout.write("\r");
  }
}
