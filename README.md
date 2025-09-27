# zshi

zshi (`zi`) is ai help in you terminal for your broken commands.

## Warning

### ⚠️ Interactive Commands & Logging

zi logs all your commands and outputs using `tee`. Most of the time this works fine, but some interactive programs may conflict with logging. If you face issues, try stopping logging temporarily:

```bash
zi stop
```

Restart logging:

```bash
zi start
```

## Installation

```bash
pnpm install -g zshi
```

## Setup

```bash
$ zi setup

Enter your API key: xxxxxxxxxxxxxx ## Your vercel AI Gateway API key
Enter model name: openai/gpt-4.1-nano ## Find your model name at https://vercel.com/ai-gateway/models

```

Reload your shell: `source ~/.zshrc` \
zi will start logging your terminal session.

## Usage

```bash
zi
## or
zi -p "## Enter your prompt here"
```

Run `zi --help` or `zi [command] --help` to see all available commands.
