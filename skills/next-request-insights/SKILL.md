---
name: next-request-insights
description: >
  Trace completed Next.js App Router request latency with Request Insights.
  Use for cold-only or intermittent slowness, or before adding instrumentation
  or collecting a CPU profile.
---

# Next.js Request Insights

Preserve the running process and its retained evidence until the latency is
attributed.

## Diagnose

1. Make Request Insights the first diagnostic command. Do not list
   the workspace, inspect processes, or read source, config, logs, or raw trace
   files first:

   ```bash
   ./node_modules/.bin/next experimental-request-insights list --route <route> --json
   ```

   If discovery fails, pass the active origin from the CLI error or project
   configuration with `--url <origin>`. This step is complete when the list
   contains the retained requests or confirms that none remain.

2. Select the completed request matching the reported route and occurrence.
   Separate it from tooling requests and warm retries by route, start time,
   duration, and status, then inspect its timeline:

   ```bash
   ./node_modules/.bin/next experimental-request-insights get <id> --json
   ```

   The ID may be the unambiguous prefix printed by the list command. This step
   is complete when one request ID is tied to the reported slowdown.

3. Attribute its wall time. Compare child spans and fetches using `startTime`,
   `durationMs`, `parentSpanId`, and span attributes. Account for the dominant
   interval and each plausible alternative, including compilation, module
   loading, instrumentation, metadata, React rendering, awaits, cache behavior,
   and response start. This step is complete when measured intervals distinguish
   the dominant phase from every plausible alternative.

4. Inspect source only to name the operation already localized by the trace.
   Treat component intervals as elapsed render time. Classify work as CPU-bound
   only when the trace or a profile supplies that evidence. This step is
   complete when the localized operation is named without overstating what ran
   on CPU.

5. Report the request ID and duration, the dominant span and duration, measured
   alternatives, and whether a CPU profile is needed. The diagnosis is complete
   when the cited intervals account for the slowdown and support the profile
   decision.

If the original trace is absent, reproduce the request once without restarting
the server and snapshot it immediately. Use a CPU profile only when Request
Insights localizes substantial CPU time but cannot identify the responsible
function.
