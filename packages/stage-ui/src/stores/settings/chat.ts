import { useLocalStorageManualReset } from '@proj-airi/stage-shared/composables'
import { defineStore } from 'pinia'

export type ChatSendMode = 'enter' | 'ctrl-enter' | 'double-enter'
export type ChatSuggestMode = 'enter' | 'ctrl-enter' | 'double-enter' | 'disabled'

export const useSettingsChat = defineStore('settings-chat', () => {
  const sendMode = useLocalStorageManualReset<ChatSendMode>('settings/chat/send-mode', 'enter')
  const suggestMode = useLocalStorageManualReset<ChatSuggestMode>('settings/chat/suggest-mode', 'double-enter')
  const streamIdleTimeoutMs = useLocalStorageManualReset<number>('settings/chat/stream-idle-timeout-ms', 600000)
  const showDirectorNotes = useLocalStorageManualReset<boolean>('settings/chat/show-director-notes', true)
  const combineSystemMessages = useLocalStorageManualReset<boolean>('settings/chat/combine-system-messages', false)
  const maxToolCalls = useLocalStorageManualReset<number>('settings/chat/max-tool-calls', 10)

  // Migration: force-update existing users from 30s to 10min
  if (streamIdleTimeoutMs.value === 30000) {
    streamIdleTimeoutMs.value = 600000
  }

  function resetState() {
    sendMode.reset()
    suggestMode.reset()
    streamIdleTimeoutMs.reset()
    showDirectorNotes.reset()
    combineSystemMessages.reset()
    maxToolCalls.reset()
  }

  return {
    sendMode,
    suggestMode,
    streamIdleTimeoutMs,
    showDirectorNotes,
    combineSystemMessages,
    maxToolCalls,
    resetState,
  }
})
