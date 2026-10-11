import type { Tool } from '@xsai/shared-chat'

import { describe, expect, it, vi } from 'vitest'

import { toolCallLimitMessage, withToolCallBudget } from './tool-call-budget'

function fakeTool(name: string, execute = vi.fn(async () => 'ok')): Tool {
  return {
    type: 'function',
    function: { name, parameters: {} },
    execute,
  } as unknown as Tool
}

describe('withToolCallBudget', () => {
  it('leaves room after the budget for the model to answer', () => {
    expect(withToolCallBudget(undefined, 10).maxSteps).toBe(13)
  })

  it('runs tools until the budget is spent, then refuses', async () => {
    const execute = vi.fn(async () => 'ok')
    const { tools } = withToolCallBudget([fakeTool('a', execute)], 2)
    const options = { messages: [], toolCallId: 'x' } as any

    expect(await tools![0].execute({}, options)).toBe('ok')
    expect(await tools![0].execute({}, options)).toBe('ok')
    expect(await tools![0].execute({}, options)).toBe(toolCallLimitMessage(2))
    expect(execute).toHaveBeenCalledTimes(2)
  })

  it('shares one budget across all tools of a reply', async () => {
    const { tools } = withToolCallBudget([fakeTool('a'), fakeTool('b')], 1)
    const options = { messages: [], toolCallId: 'x' } as any

    expect(await tools![0].execute({}, options)).toBe('ok')
    expect(await tools![1].execute({}, options)).toBe(toolCallLimitMessage(1))
  })

  it('treats a non-positive limit as one call', () => {
    expect(withToolCallBudget(undefined, 0).maxSteps).toBe(4)
  })
})
