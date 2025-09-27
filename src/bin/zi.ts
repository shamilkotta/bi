#!/usr/bin/env node

import { Command, Option } from "commander";
import setupShell from "../setup";
import { checkSetup } from "../utils/verifyConfig";
import ziHelp from "../help";
import log from "../log";

class ZiCommand extends Command {
  createCommand(name: string) {
    const command = new Command(name);

    command.hook("preAction", checkSetup);

    return command;
  }
}

const program = new ZiCommand();

program
  .name("zi")
  .description("A light intelligence in your zsh")
  .version("0.1.0", "-v, --version", "Show the installed zi version");

program
  .command("setup")
  .description("Configure shell integration for zi")
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
  .description("Generate zi response")
  .option("-p, --prompt <prompt>", "Additional context or prompt to include")
  .option("-m, --model <model>", "Model to use for the response")
  .option("-s, --skip", "Skip the context")
  .action(ziHelp);

program
  .command("log")
  .description("Show the log of the current session")
  .action(log);

program
  .command("checkpoint")
  .alias("cp")
  .description("Start a fresh context. Previous context is cleared.")
  .action(() => {});

program
  .command("clear")
  .alias("clr")
  .description(
    "Clear the terminal display and reset the current context \n(Unlike the standard 'clear', which resets only the screen)"
  )
  .action(() => {});

program
  .command("stop")
  .description("Stop logging the current session")
  .action(() => {});

program
  .command("start")
  .description("Start logging the current session")
  .action(() => {});

program.parse(process.argv);
