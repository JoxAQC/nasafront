'use server';

/**
 * @fileOverview An AI agent to assess the damage of a meteorite impact.
 *
 * - assessImpactDamage - A function that handles the impact damage assessment process.
 * - AssessImpactDamageInput - The input type for the assessImpactDamage function.
 * - AssessImpactDamageOutput - The return type for the assessImpactDamage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessImpactDamageInputSchema = z.object({
  latitude: z
    .number()
    .describe('Latitude of the impact location.  Must be a valid WGS84 coordinate.'),
  longitude: z
    .number()
    .describe('Longitude of the impact location. Must be a valid WGS84 coordinate.'),
  meteoriteSizeInKilograms: z
    .number()
    .describe('The mass of the meteorite in kilograms.'),
  radiusInKilometers: z
    .number()
    .describe('The radius around the impact zone to assess damage within, in kilometers.'),
});
export type AssessImpactDamageInput = z.infer<typeof AssessImpactDamageInputSchema>;

const AssessImpactDamageOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A summary of the estimated damage within the specified radius of the impact zone, based on AI analysis of GIS and geological data.'
    ),
  funFact: z
    .string()
    .describe(
      'An interesting and educational fact that contextualizes the impact\'s scale, like comparing it to a famous landmark or a historical event.'
    ),
  craterDiameterKm: z
    .number()
    .describe('The estimated diameter of the impact crater in kilometers.'),
  riskLevel: z
    .enum(['Low', 'Moderate', 'High', 'Catastrophic'])
    .describe(
      'A classification of the risk level based on the potential for destruction.'
    ),
  icon: z
    .enum(['Mountain', 'Building2', 'Landmark', 'Bomb'])
    .describe(
      'An icon name representing the scale of the impact. Options: Mountain, Building2, Landmark, Bomb.'
    ),
});
export type AssessImpactDamageOutput = z.infer<typeof AssessImpactDamageOutputSchema>;

export async function assessImpactDamage(input: AssessImpactDamageInput): Promise<AssessImpactDamageOutput> {
  return assessImpactDamageFlow(input);
}

const assessImpactDamagePrompt = ai.definePrompt({
  name: 'assessImpactDamagePrompt',
  input: {schema: AssessImpactDamageInputSchema},
  output: {schema: AssessImpactDamageOutputSchema},
  prompt: `You are an expert in assessing the damage caused by meteorite impacts.

  Given the location of the impact (latitude: {{latitude}}, longitude: {{longitude}}), the size of the meteorite ({{meteoriteSizeInKilograms}} kilograms), and the radius around the impact zone to assess ({{radiusInKilometers}} kilometers),
  provide a detailed damage assessment.

  Your response must include:
  1.  A summary of the estimated damage, considering population density, infrastructure, and environmental factors. Include potential effects like seismic activity, air blast, and thermal radiation.
  2.  An estimated crater diameter in kilometers.
  3.  A "fun fact" to contextualize the scale. Be creative and educational. Examples: "The energy released is equivalent to X atomic bombs." or "A crater this size could fit the entire city of Y inside." or "If this crater were a mountain, it would be the Nth tallest in the world."
  4.  A risk level: 'Low', 'Moderate', 'High', or 'Catastrophic'.
  5.  An icon that best represents the scale of the event: 'Mountain' for huge geological impact, 'Building2' for city-level damage, 'Landmark' for a significant but localized event, or 'Bomb' for immense energy release.
  `,
});

const assessImpactDamageFlow = ai.defineFlow(
  {
    name: 'assessImpactDamageFlow',
    inputSchema: AssessImpactDamageInputSchema,
    outputSchema: AssessImpactDamageOutputSchema,
  },
  async input => {
    const {output} = await assessImpactDamagePrompt(input);
    return output!;
  }
);
