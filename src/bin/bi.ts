#!/usr/bin/env node

import { Command, Option } from "commander";
import setupShell from "../setup";
import { checkSetup } from "../utils/verifyConfig";
import biHelp from "../help";

class BiCommand extends Command {
  createCommand(name: string) {
    const command = new Command(name);

    command.hook("preAction", checkSetup);

    return command;
  }
}

const program = new BiCommand();

program
  .name("bi")
  .description("A light intelligence in your bash")
  .version("0.1.0", "-v, --version", "Show the installed bi version");

program
  .command("setup")
  .description("Configure shell integration for bi")
  .addOption(
    new Option(
      "-s, --shell <shell>",
      "Shell to configure (default: auto)"
    ).choices(["bash", "zsh"])
  )
  .option("-m, --model <model>", "Model to use for the response")
  .option("--apiKey <apiKey>", "Vercel AI Gateway API key")
  .action(setupShell);

program
  .command("help", { isDefault: true })
  .description("Generate BI response")
  .option("-p, --prompt <prompt>", "Additional context or prompt to include")
  .option("-m, --model <model>", "Model to use for the response")
  .option("-s, --skip", "Skip the context")
  .action(biHelp);

program
  .command("checkpoint")
  .alias("cp")
  .description("Start a fresh context. Previous context is cleared.")
  .action(() => {});

program
  .command("clear")
  .alias("clr")
  .description(
    "Clear the terminal display without resetting the current context \n(Unlike the standard 'clear', which resets both screen and context)"
  )
  .action(() => {
    process.stdout.write("\x1Bc");
  });

program.parse(process.argv);
