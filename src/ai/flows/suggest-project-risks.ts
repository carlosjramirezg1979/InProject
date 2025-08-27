'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting project risks based on project details.
 *
 * - suggestProjectRisks - A function that takes project details as input and returns a list of suggested risks.
 * - SuggestProjectRisksInput - The input type for the suggestProjectRisks function.
 * - SuggestProjectRisksOutput - The return type for the suggestProjectRisks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProjectRisksInputSchema = z.object({
  projectDescription: z
    .string()
    .describe('A detailed description of the project, including its goals, scope, and key activities.'),
  projectType: z.string().describe('The type of project (e.g., software development, construction, marketing campaign).'),
  projectTimeline: z.string().describe('The planned timeline for the project, including start and end dates.'),
  projectBudget: z.string().describe('The allocated budget for the project.'),
  projectTeamSkills: z
    .string()
    .describe('A description of the skills and experience of the project team.'),
  projectDependencies: z
    .string()
    .describe('Dependencies on other projects or external factors.'),
  projectAssumptions: z.string().describe('Assumptions made during project planning.'),
  riskAppetite: z.string().describe('A description of organization risk tolerance.'),
});
export type SuggestProjectRisksInput = z.infer<typeof SuggestProjectRisksInputSchema>;

const SuggestProjectRisksOutputSchema = z.object({
  risks: z
    .array(
      z.object({
        riskName: z.string().describe('The name of the risk.'),
        riskDescription: z.string().describe('A detailed description of the risk and its potential impact.'),
        riskLikelihood: z.string().describe('Likelihood of this risk occurring (High, Medium, Low)'),
        riskImpact: z.string().describe('Impact to the project if this risk occurs (High, Medium, Low)'),
        mitigationStrategies: z
          .array(z.string())
          .describe('A list of strategies to mitigate the risk.'),
        relevantFactors: z.array(z.string()).describe('The ProjectWise project input factors that made this risk relevant.'),
      })
    )
    .describe('A list of potential risks associated with the project.'),
});
export type SuggestProjectRisksOutput = z.infer<typeof SuggestProjectRisksOutputSchema>;

export async function suggestProjectRisks(input: SuggestProjectRisksInput): Promise<SuggestProjectRisksOutput> {
  return suggestProjectRisksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProjectRisksPrompt',
  input: {schema: SuggestProjectRisksInputSchema},
  output: {schema: SuggestProjectRisksOutputSchema},
  prompt: `You are an experienced project risk manager.  For the project described below, please identify potential risks. For each risk, list the risk name, a detailed description of the risk and its potential impact, likelihood of the risk occurring (High, Medium, Low), impact to the project if this risk occurs (High, Medium, Low), a list of strategies to mitigate the risk, and the ProjectWise project input factors that made this risk relevant.

Project Description: {{{projectDescription}}}
Project Type: {{{projectType}}}
Project Timeline: {{{projectTimeline}}}
Project Budget: {{{projectBudget}}}
Project Team Skills: {{{projectTeamSkills}}}
Project Dependencies: {{{projectDependencies}}}
Project Assumptions: {{{projectAssumptions}}}
Organization risk tolerance: {{{riskAppetite}}}

Return the risks in JSON format.
`,
});

const suggestProjectRisksFlow = ai.defineFlow(
  {
    name: 'suggestProjectRisksFlow',
    inputSchema: SuggestProjectRisksInputSchema,
    outputSchema: SuggestProjectRisksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
