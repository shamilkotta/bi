#!/usr/bin/env node

import { Command } from "commander";

class BiCommand extends Command {
  createCommand(name: string) {
    const command = new Command(name);

    command.hook("preAction", (event) => {
      const commandName = event.name();
      console.log({ commandName });
    });

    return command;
  }
}

const program = new BiCommand();

program
  .name("bi")
  .description("A light intelligence in your bash")
  .version("0.1.0", "-v, --version", "Show the installed bi version");

program
  .command("help", { isDefault: true })
  .description("Generate BI response")
  .option("-m, --message <message>", "Additional context or message to include")
  .action((_, options) => {
    const { message } = options.opts();
    console.log("Generating bi response", message);
    // program.help();
  });

program
  .command("checkpoint")
  .alias("cp")
  .description("Start a fresh context. Previous context is cleared.")
  .option("-n, --name <name>", "Optional name for the checkpoint")
  .action((_, options) => {
    const { name } = options.opts();
    console.log("Creating checkpoint", name);
  });

program
  .command("clear")
  .alias("clr")
  .description(
    "Clear the terminal display without resetting the current context \n(Unlike the standard 'clear', which resets both screen and context)"
  )
  .action(() => {
    console.log("Clearing the terminal");
    process.stdout.write("\x1Bc");
  });

program.parse(process.argv);
