'use server';

import { assessImpactDamage, AssessImpactDamageInput } from '@/ai/flows/assess-impact-damage';
import { z } from 'zod';

const actionSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  meteoriteSizeInKilograms: z.number(),
  radiusInKilometers: z.number(),
});

export async function getImpactAssessment(input: AssessImpactDamageInput) {
  try {
    const validatedInput = actionSchema.parse(input);
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
