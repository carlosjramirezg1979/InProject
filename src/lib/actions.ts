'use server';

import { SuggestProjectRisksInput } from "@/ai/flows/suggest-project-risks";

export async function suggestRisksAction(input: SuggestProjectRisksInput) {
  try {
    // const result = await suggestProjectRisks(input);
    // return { success: true, data: result };
    console.log("AI functionality is temporarily disabled.");
    return { success: true, data: { risks: [] } };
  } catch (error) {
    console.error("Error suggesting project risks:", error);
    return { success: false, error: "Failed to suggest project risks." };
  }
}
