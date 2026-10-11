import type { Tool } from '@xsai/shared-chat'

// NOTICE: @xsai ends the tool loop after `maxSteps` rounds even when the last round only
// executed tools, so the model never gets to reply. Rounds beyond the call budget leave room
// for the model to read the refusal and answer.
const ANSWER_ROUNDS = 3

export function toolCallLimitMessage(limit: number) {
  return `Tool call limit reached (${limit} per reply). Do not call any more tools; answer the user now with what you have.`
}

export function withToolCallBudget(tools: Tool[] | undefined, maxToolCalls: number): { tools: Tool[] | undefined, maxSteps: number } {
  const limit = Math.max(1, Math.floor(maxToolCalls))
  const maxSteps = limit + ANSWER_ROUNDS
  if (!tools?.length)
    return { tools, maxSteps }

  let used = 0
  return {
    maxSteps,
    tools: tools.map(tool => ({
      ...tool,
      execute: async (input, options) => {
        if (used >= limit)
          return toolCallLimitMessage(limit)
        used++
        return tool.execute(input, options)
      },
    })),
  }
}
