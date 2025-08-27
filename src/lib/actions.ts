
'use server';

import type { SuggestProjectRisksInput } from "@/ai/flows/suggest-project-risks";

export async function suggestRisksAction(input: SuggestProjectRisksInput) {
  try {
    // Dynamic import to avoid initialization conflicts
    const { suggestProjectRisks } = await import('@/ai/flows/suggest-project-risks');
    const result = await suggestProjectRisks(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error suggesting project risks:", error);
    // It's better to provide a more specific error message if possible
    const errorMessage = error instanceof Error ? error.message : "Failed to suggest project risks.";
    return { success: false, error: errorMessage };
  }
}
