'use server';

/**
 * @fileOverview A contextual chatbot for the NeoSentinel application.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const HistoryItemSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ChatInputSchema = z.object({
  history: z.array(HistoryItemSchema),
  message: z.string(),
});

export async function contextualChat(input: z.infer<typeof ChatInputSchema>): Promise<string> {
    const { history, message } = input;

    const { text } = await ai.generate({
        prompt: message,
        history: history.map(item => ({
            role: item.role,
            content: [{ text: item.content }],
        })),
        system: `You are a helpful AI assistant named Neo, embedded in the NeoSentinel application.
        Your purpose is to answer questions related to asteroids, meteorite impacts, and space science.
        IMPORTANT: Your answers must be short, to the point, and very easy to understand. Avoid technical jargon at all costs. Be friendly and informative.
        Today's date is ${new Date().toDateString()}.
        The application you are in simulates meteorite impacts on Earth.`
    });

    return text;
}
