'use server';

import { assessImpactDamage, AssessImpactDamageInput, AssessImpactDamageOutput } from '@/ai/flows/assess-impact-damage';
import { contextualChat } from '@/ai/flows/contextual-chat';
import { Asteroid } from '@/lib/asteroid-data';
import { z } from 'zod';

const impactActionSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  meteoriteSizeInKilograms: z.number(),
  radiusInKilometers: z.number(),
});

export async function getImpactAssessment(input: AssessImpactDamageInput) {
  try {
    const validatedInput = impactActionSchema.parse(input);
    const result = await assessImpactDamage(validatedInput);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid input data provided to the server.' };
    }
    return { success: false, error: 'The AI model failed to assess damage. Please try again.' };
  }
}

const chatHistorySchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
});

const appContextSchema = z.object({
    type: z.enum(['simulationStart', 'reportGenerated']),
    data: z.any(),
});


const chatActionSchema = z.object({
    history: z.array(chatHistorySchema),
    message: z.string().optional(),
    appContext: appContextSchema.optional(),
});


export async function getChatbotResponse(input: z.infer<typeof chatActionSchema>) {
    try {
        const validatedInput = chatActionSchema.parse(input);
        const result = await contextualChat(validatedInput);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        if (error instanceof z.ZodError) {
            return { success: false, error: 'Invalid chat input.' };
        }
        return { success: false, error: 'The AI model failed to respond. Please try again.' };
    }
}
