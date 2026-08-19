# n8n-nodes-slideforge

This is an n8n community node. It lets you use [SlideForge](https://slideforge.dev) in your n8n workflows.

SlideForge turns structured content into native, editable PowerPoint — real text boxes and shapes, not a picture of a slide. A render takes under a second, your numbers and wording are bound verbatim, and every render comes back with a per-field fidelity report so a workflow can tell whether the slide is trustworthy before it sends it on.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Slide

- **Create From Brief** — describe the slide in plain text; SlideForge picks the layout and binds your words.
- **Create From Layout** — bind your own content to a named layout for a deterministic, repeatable render.

### Deck

- **Create** — render up to 30 slides in parallel and merge them into one file.
- **Outline** — preview the planned slides and the price before rendering. Free.

### Job

- **Get** — status, fidelity report and warnings for one render.
- **Get Many** — list your recent renders.
- **Download PowerPoint** — attach the .pptx to the item as binary data.
- **Download Preview** — attach the PNG preview to the item as binary data.

### Catalog

- **Get Many Layouts** — every layout, what it is for, and which fields it binds. Free.
- **Get Layout Schema** — the fields, capacity and examples for one layout. Free.

## Credentials

You need a SlideForge API key.

1. Sign up at [slideforge.dev](https://slideforge.dev). New accounts get **60 free slides** — no card.
2. Go to [**Console → API Keys**](https://slideforge.dev/console/keys) and create a key. It starts
   with `sf_live_`.
3. In n8n, add a **SlideForge API** credential and paste the key.

The credential authenticates with `Authorization: Bearer <key>`.

## Compatibility

Tested against n8n 2.34. Requires Node.js 20 or later.

## Usage

A common shape is three nodes: build the content, render it, then send the file.

1. **SlideForge → Deck → Create** with a `slides` array, for example:

```json
[
  { "brief": "Q3 revenue grew 22% to $4.1M, driven by enterprise renewals" },
  {
    "form": "agenda_list",
    "headline": "What we will cover",
    "blocks": [{ "label": "Results" }, { "label": "Pipeline" }, { "label": "Asks" }]
  }
]
```

2. **SlideForge → Job → Download PowerPoint** with the `job_id` from step 1.
3. **Gmail / Slack / Google Drive** with the binary property `data`.

Check `status` and `fidelity` on the render response before sending the deck onward: a render that is not `complete` is never billed, and its warnings say exactly which field did not fit.

Use **Catalog → Get Many Layouts** once to see the layout names, then **Get Layout Schema** for the exact fields a layout binds.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [SlideForge API documentation](https://slideforge.dev/docs)
- [SlideForge layout catalog](https://slideforge.dev/gallery)
