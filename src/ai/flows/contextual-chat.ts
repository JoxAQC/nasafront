'use server';

/**
 * @fileOverview A contextual chatbot for the NeoSentinel application.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { AssessImpactDamageOutput } from './assess-impact-damage';
import { Asteroid } from '@/lib/asteroid-data';

const HistoryItemSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const AppContextSchema = z.object({
  type: z.enum(['simulationStart', 'reportGenerated']),
  data: z.any(),
});

const ChatInputSchema = z.object({
  history: z.array(HistoryItemSchema),
  message: z.string().optional(),
  appContext: AppContextSchema.optional(),
});

export async function contextualChat(input: z.infer<typeof ChatInputSchema>): Promise<string> {
    const { history, message, appContext } = input;

    let prompt = message || '';

    if (appContext) {
        if (appContext.type === 'simulationStart') {
            const asteroid = appContext.data as Asteroid;
            prompt = `Tell me a single, brief, and interesting "did you know?" style fun fact about the asteroid named "${asteroid.full_name}". Be very concise.`;
        } else if (appContext.type === 'reportGenerated') {
            const report = appContext.data as AssessImpactDamageOutput;
            prompt = `The impact simulation just finished. The result was a "${report.riskLevel}" risk event. Give me a single, short, witty, and reassuring comment about this result. If it's catastrophic, remind me that these are very low-probability events. Be comical, informative, and hopeful. For example: "Phew, just a scratch!" or "Good thing the dinosaurs aren't here to see this. Statistically, we're safe... for now!"`;
        }
    }

    if (!prompt) {
        return "I'm sorry, I didn't receive a message. What would you like to talk about?";
    }

    const { text } = await ai.generate({
        prompt: prompt,
        history: history.map(item => ({
            role: item.role,
            content: [{ text: item.content }],
        })),
        system: `You are a helpful AI assistant named Neo, embedded in the NeoSentinel application.
        Your purpose is to answer questions related to asteroids, meteorite impacts, and space science.
        IMPORTANT: Your answers must be short, to the point, and very easy to understand. Avoid technical jargon at all costs. Be friendly, witty, and informative.
        Today's date is ${new Date().toDateString()}.
        The application you are in simulates meteorite impacts on Earth.`
    });

    return text;
}
