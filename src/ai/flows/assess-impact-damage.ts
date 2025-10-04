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
  provide a summary of the estimated damage, considering GIS and geological data.
  Consider population density, infrastructure, and environmental factors in your assessment.
  Include potential effects such as seismic activity, air blast damage, thermal radiation, and crater formation.
  Format your response as a concise paragraph.
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
