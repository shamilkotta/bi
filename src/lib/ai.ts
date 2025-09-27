import { createGateway, streamText } from "ai";
import { systemPrompt } from "../utils/system";
import { errorAndExit } from "../utils/console";

type AiResponseProps = {
  prompt: string;
  model: string;
  apiKey: string;
  history?: any[];
  onStart?: () => void;
};

export const generateAiResponse = async ({
  prompt: message,
  model = "openai/gpt-4.1-mini",
  apiKey,
  history,
  onStart
}: AiResponseProps) => {
  try {
    if (
      !message?.trim() &&
      (!history || !Array.isArray(history) || !history.length)
    ) {
      errorAndExit("Either custom prompt or context is required");
    }

    if (!apiKey) {
      errorAndExit("API key is required");
    }

    const gateway = createGateway({ apiKey });

    const { models } = await gateway.getAvailableModels();
    const textModels = models.filter((m) => m.modelType === "language");
    if (!textModels.find((m) => m.id === model)) {
      errorAndExit(`Invalid model specified: ${model}`);
    }

    let prompt = `context: ${JSON.stringify(history, null, 2)}`;
    if (message?.trim()) {
      prompt += `\n\n user prompt: ${message}`;
    }

    let isFirst = false;

    const res = streamText({
      model: gateway(model),
      prompt,
      system: systemPrompt,
      temperature: 0.7,
      onError: (error) => {
        onStart?.();
        console.log("\n");
        console.error(error);
        errorAndExit("AI streaming error");
      },
      onChunk: ({ chunk }) => {
        if (chunk.type === "text-delta") {
          if (!isFirst && onStart) {
            onStart();
            isFirst = true;
          }
          process.stdout.write(chunk.text);
        }
      }
    });
    await res.text;
  } catch (error) {
    onStart?.();
    console.error("AI streaming error:", error);
    errorAndExit("Internal server error");
  }
};
