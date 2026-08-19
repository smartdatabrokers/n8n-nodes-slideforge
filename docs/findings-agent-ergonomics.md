# Why the AI-Agent path is hard to wire, and what to fix

**Status:** findings recorded 2026-08-19, fix **deferred** until n8n's manual review of 0.1.3 lands.
Publishing a new version mid-review may reset or confuse it.

Everything below was measured against n8n 2.34.6 with `n8n-nodes-slideforge@0.1.3` installed from npm
and pointed at production.

## The symptom

Wiring the node as a tool under an AI Agent could not be done in one pass. Every mistake surfaced to
the user as:

> "I wasn't able to generate the slide — it looks like the service returned an error.
> **Service issue:** SlideForge may be temporarily unavailable. Try again in a moment."

The service was fine every single time. Three separate defects hid behind that one sentence.

## Root cause: n8n discards our error text

Our API returned exactly what was needed:

```json
{ "type": ".../intent-invalid-shape", "title": "Intent fields failed validation", "status": 422,
  "detail": "blocks.0: Input should be a valid dictionary or instance of IRBlock; blocks.1: ...",
  "code": "intent_invalid_shape", "actionable": true,
  "remedy": "Fix the named fields to their documented types — browse_catalog(type=schema, family=<form>) shows the exact shape." }
```

n8n never shows it. In
`n8n-workflow/dist/cjs/errors/node-api.error.js` → `setDefaultStatusCodeMessage()`, any response with
a known HTTP status has its `message` **overwritten** from a status-code table:

```js
if (STATUS_CODE_MESSAGES[this.httpCode]) {
    this.addToMessages(this.message);
    this.message = STATUS_CODE_MESSAGES[this.httpCode];   // 422 -> "Your request is invalid..."
    return;
}
```

Our text is parsed (`detail` is in `POSSIBLE_ERROR_MESSAGE_KEYS`) but assigned to `description`, which
the agent tool wrapper does not return. The observation the model receives is:

```json
[{"error":"Your request is invalid or could not be processed by the service"}]
```

**Consequence: the correction loop is severed.** The agent retried twice with byte-identical input,
then invented an outage. A human has to open the execution log to see the real cause. **No API-side
change fixes this** — n8n discards the body whatever field we put the text in.

## The fix (node-side, ~30 lines)

Set `ignoreHttpStatusErrors: true` on the routing requests and add a shared `postReceive` that
inspects the body:

- **Error body present** → for a tool call, return our envelope as the item so `detail` + `remedy`
  reach the model and it can correct itself on the next call; for a normal call, throw a
  `NodeOperationError` carrying `detail` (that message is *not* overwritten, unlike `NodeApiError`).
- **Normal body** → pass through untouched.

One change, both audiences: the agent self-corrects, and the human sees
`blocks.0: Input should be a valid dictionary` instead of a false outage report.

Contract test to write with it: *a 422 from the API reaches the caller with its own detail, not a
status-code platitude.*

## The three defects that hid behind the generic message

### 1. `Blocks` is offered on layouts that cannot bind it

`Create From Layout` exposes `blocks` and `data` unconditionally. n8n auto-wires `$fromAI` onto every
visible field, so on `kpi_metrics` — which has no list slot — the model fills `blocks` with plain
strings and the call 422s every time. Workaround today: delete the Blocks field from the tool node.

Real fix is not a single blob field (that regresses the human path). Options worth weighing:
- drive `displayOptions` from the selected layout, if n8n can express it against a dynamic value;
- or emit `blocks`/`data` as one polymorphic `content` field whose description names the per-layout
  shape, keeping the typed fields for the UI path.

### 2. The `$fromAI` hint is generated empty

n8n writes `$fromAI('Data', ``, 'json')` — **an empty description**. Our field description is not
forwarded, so the model has no idea of the shape and sends a flat object:

```json
{"Revenue": "$4.1M", "Enterprise Renewals": "94%"}       // wrong
{"metrics": [{"label": "Revenue", "value": "$4.1M", "sub": "+22% QoQ"}]}   // right
```

Adding the shape to the hint by hand fixed it on the first call — `complete`, `fidelity: verbatim`,
`kpi_metrics` / `delta_scoreboard`. Worth checking whether n8n forwards a `toolDescription` or the
operation `description` into the generated hint; if it does, the contract belongs there.

### 3. `job_id` is not on the agent's output

The agent returns prose, so a following **Job → Download PowerPoint** has nothing to bind to. This
one is n8n's design, not ours. The working recipe:

1. AI Agent → Options → **Return Intermediate Steps**
2. Download node → Job ID:
   `={{ JSON.parse($json.intermediateSteps.at(-1).observation)[0].job_id }}`

`observation` is a string holding a JSON array, hence the parse and the index. Verified end to end:
chat message in, named `.pptx` binary out.

`observation` is a string because n8n stringifies every tool result for the model — that part is not
ours to change. But the *need* to parse it is ours to remove, two ways, neither requiring an API
change:

**(a) `Job ID` accepts "most recent" (recommended).** Add a mode to the Job resource — leave the ID
empty, or pick "Latest render", and the node calls `GET /v1/jobs?limit=1` itself and downloads that.
The download node then works after *any* SlideForge step, agent or deterministic, with no expression
at all. **Honest caveat:** "latest" is per API key, so two workflows rendering concurrently on the
same key could cross. Scope it by `job_type` and document the caveat rather than pretend it away.

**(b) A `Create and Download` operation.** One step renders and returns the `.pptx` as binary, so
there is no second node and no id to carry. Removes the problem entirely for the deterministic path;
for tool use the agent still only gets text back, so (a) is what fixes the agent case.

Do (a) first: it is smaller, and it is the one that answers "how do I get the file after an agent".

## What was already fixed

The Tool port needs **"SlideForge Tool"** (`n8n-nodes-slideforge.slideforgeTool`), the type n8n
synthesises from `usableAsTool`. Attaching the ordinary node there fails with *"Node does not have a
`supplyData` method defined"*. That is n8n's naming, documented in the demo playbook rather than
fixable here.
