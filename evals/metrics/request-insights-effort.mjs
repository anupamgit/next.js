import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export const collectFailed = true

export async function collect(directory) {
  const { events } = JSON.parse(
    readFileSync(join(directory, 'transcript.json'), 'utf8')
  )
  const firstShell = events.find(
    (event) => event.type === 'tool_call' && event.tool?.name === 'shell'
  )
  const command = firstShell?.tool?.args?.command ?? ''

  return {
    requestInsightsCliFirst:
      /(?:node_modules\/\.bin\/next|\bnext)\s+experimental-request-insights\b/.test(
        command
      ),
  }
}
