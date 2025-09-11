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
  .description("")
  .version("0.1.0", "-v, --version", "Outputs bi version");
