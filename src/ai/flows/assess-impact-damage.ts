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
      'A summary of the estimated damage. Use conditional language like "could generate..." for catastrophic claims (e.g., seismic events) unless backed by geophysical models, stating that detailed modeling is needed for precise magnitudes.'
    ),
  funFact: z
    .string()
    .describe(
      'An interesting and educational fact that contextualizes the impact\'s scale. It must provide a relatable comparison for the impact energy (e.g., "equivalent to X atomic bombs"), the crater diameter (e.g., "could fit the entire city of Y inside"), or the blast radius.'
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
    mitigationStrategies: z
    .array(z.string())
    .describe(
      'A list of actionable impact mitigation strategies for the general population.'
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
  prompt: `You are an expert in assessing the damage caused by meteorite impacts. Your tone must be scientific and cautious.

  Given the location of the impact (latitude: {{latitude}}, longitude: {{longitude}}), the size of the meteorite ({{meteoriteSizeInKilograms}} kilograms), and the radius around the impact zone to assess ({{radiusInKilometers}} kilometers),
  provide a detailed damage assessment.

  CRITICAL GUIDELINES:
  - DO NOT invent specific, catastrophic numbers for effects like seismic magnitudes (e.g., "magnitude 11 earthquake"). Instead, use cautious, conditional language. For example: "The impact could generate significant seismic waves, but detailed geophysical modeling would be required to estimate a precise magnitude."
  - Frame your summary in terms of potential effects and risks, not certainties.

  Your response must include:
  1.  A "fun fact" to contextualize the scale of the impact. This fact MUST be a relatable analogy. Be creative and educational.
      - For energy, compare it to something understandable, like "The energy released is equivalent to X Tsar Bomba explosions."
      - For crater size, compare it to a landmark, like "A crater this size could fit the entire city of Y inside."
      Pick the most impactful and easily understood analogy.
  2.  A summary of the estimated damage. Follow the critical guidelines above. Mention potential effects like seismic activity, air blast, and thermal radiation in a qualitative or conditional manner.
  3.  An estimated crater diameter in kilometers.
  4.  A risk level: 'Low', 'Moderate', 'High', or 'Catastrophic'.
  5.  An icon that best represents the scale of the event: 'Mountain' for huge geological impact, 'Building2' for city-level damage, 'Landmark' for a significant but localized event, or 'Bomb' for immense energy release.
  6.  A list of 3-4 actionable mitigation strategies for the general population to consider in such an event (e.g., shelter-in-place, evacuation routes, emergency kits).
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
