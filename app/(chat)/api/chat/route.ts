import { convertToCoreMessages, Message, streamText } from "ai";
import { z } from "zod";

import { customModel } from "@/ai";
import { auth } from "@/app/(auth)/auth";
import { CHAT_SYSTEM_PROMPT, JOURNAL_ANALYSIS_PROMPT } from "@/constants/Prompts";
import { deleteChatById, getChatById, saveChat } from "@/db/queries";

export async function POST(request: Request) {
  const { id, messages }: { id: string; messages: Array<Message> } =
    await request.json();
  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const coreMessages = convertToCoreMessages(messages);

  // Extract common streamText options
  const baseStreamOptions = {
    model: customModel,
    experimental_telemetry: {
      isEnabled: true,
      functionId: "stream-text",
    },
  };

  try {
    const result = await streamText({
      ...baseStreamOptions,
      system: id ? CHAT_SYSTEM_PROMPT : JOURNAL_ANALYSIS_PROMPT,
      messages: coreMessages,
      ...(id && {
        maxSteps: 5,
        onFinish: async ({ responseMessages }) => {
          if (session.user?.id) {
            try {
              await saveChat({
                id,
                messages: [...coreMessages, ...responseMessages],
                userId: session.user.id,
              });
            } catch (error) {
              console.error("Failed to save chat:", error);
            }
          }
        },
      }),
    });

    return result.toDataStreamResponse({});
  } catch (error) {
    console.error("Stream processing failed:", error);
    return new Response("Failed to process stream", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await deleteChatById({ id });

    return new Response("Chat deleted", { status: 200 });
  } catch (error) {
    return new Response("An error occurred while processing your request", {
      status: 500,
    });
  }
}
