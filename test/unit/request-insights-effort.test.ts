import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const repository = path.join(__dirname, '../..')

it('records whether Request Insights was the first shell command', () => {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), 'request-insights-effort-')
  )
  try {
    fs.writeFileSync(
      path.join(root, 'result.json'),
      JSON.stringify({ status: 'failed' })
    )
    fs.writeFileSync(path.join(root, 'transcript-raw.jsonl'), '')
    fs.writeFileSync(
      path.join(root, 'transcript.json'),
      JSON.stringify({
        events: [
          {
            type: 'tool_call',
            tool: {
              name: 'shell',
              args: {
                command:
                  './node_modules/.bin/next experimental-request-insights list --json',
              },
            },
          },
        ],
      })
    )

    execFileSync(
      process.execPath,
      [
        '--import=tsx',
        'evals/metrics/report.mjs',
        'collect',
        root,
        'request-insights-effort',
      ],
      { cwd: repository }
    )

    expect(
      JSON.parse(fs.readFileSync(path.join(root, 'metrics.json'), 'utf8'))
    ).toMatchObject({
      status: 'failed',
      collector: { requestInsightsCliFirst: true },
    })
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})
