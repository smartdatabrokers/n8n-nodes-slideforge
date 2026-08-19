# Publishing and getting verified

Nothing here is published yet. This is the exact remaining sequence, in order.

## Where this stands

| | |
|---|---|
| npm package name | `n8n-nodes-slideforge` — **free**, nothing published |
| npm account | **does not exist yet.** Our only package registry today is PyPI (`slideforge-mcp`, account `slideforge`) |
| GitHub repo | `smartdatabrokers/n8n-nodes-slideforge`, public, MIT |
| Creator Portal | logged in as `slideforge`; the node submission form is self-serve |
| Built + tested | yes — see the smoke test below |

## Step 1 — npm account and org (Tom)

1. Create an npm account for the company. Use the same identity as PyPI:
   username `slideforge`, email `support@slideforge.dev`.
2. Enable 2FA. npm requires it for publishing.
3. No org/scope is needed — the package is unscoped (`n8n-nodes-slideforge`), which is what
   n8n's docs show and what every sampled community node uses.

## Step 2 — first publish

The name has never been published, so Trusted Publishing cannot be configured yet: npm only
offers that setting on an existing package. Two ways round it, pick one.

**Option A — publish 0.1.0 by hand once, then switch to OIDC forever.**

```sh
npm login
npm publish            # from this directory, after `npm run build`
```

That first version has **no provenance**, so do not submit it for verification. Then do
step 3 and cut `0.1.1` through the workflow — that one carries provenance and is the one
we submit.

**Option B — publish the first version from CI with a granular token.**

1. npm → Access Tokens → Generate New Token → Granular Access Token, read+write, scoped to
   this package.
2. GitHub → repo Settings → Secrets and variables → Actions → new secret `NPM_TOKEN`.
3. `npm run release` locally; the tag push triggers `.github/workflows/publish.yml`, which
   publishes with `--provenance`.
4. Afterwards do step 3 and delete the token.

Option B gets a provenance-carrying 0.1.0 in one go and is what I would do.

## Step 3 — Trusted Publishing (OIDC), after the package exists

npmjs.com → the package → Settings → Publish access → Trusted Publishers → Add a publisher:

| Field | Value |
|---|---|
| Provider | GitHub Actions |
| Repository owner | `smartdatabrokers` |
| Repository name | `n8n-nodes-slideforge` |
| Workflow name | `publish.yml` |
| Environment | leave blank |

Then remove the `NPM_TOKEN` secret from the repo. The workflow already handles both paths:
with the secret unset it falls through to the OIDC exchange.

## Step 4 — submit for review

1. Confirm the published tarball passes n8n's own scan:
   `npx @n8n/scan-community-package n8n-nodes-slideforge`
2. Go to https://creators.n8n.io/nodes (logged in as `slideforge`) → **Submit node package**.
3. Paste `https://www.npmjs.com/package/n8n-nodes-slideforge`.
4. Tick **I confirm that I am the author of this node** and **I am an official representative
   of this integration** — both are true.
5. Submit for review.

n8n publishes no review SLA. They also reserve the right to reject nodes that compete with
their paid features; a PowerPoint renderer does not.

## Releasing a new version, once set up

```sh
npm run release        # lint, build, bump, changelog, commit, tag, push
```

The tag push is what publishes. Do not run `npm publish` by hand again — a hand-published
version has no provenance, and n8n's verification requires it.

## What we checked against n8n's rules

- Declarative style, built with `@n8n/node-cli` — required for verified authors
- **Zero runtime dependencies** — `dependencies` is empty; only devDependencies and the
  `n8n-workflow` peer
- MIT licence; package name starts with `n8n-nodes-`; keyword `n8n-community-node-package`
- No filesystem or environment-variable access anywhere in the node
- One service per package, and it is not a Logic or Flow-control node
- English-only interface and documentation
- `npm run lint` is clean, including n8n's own community-node ruleset

## Smoke test (repeatable)

Against **production**, through n8n 2.34.6 in Docker:

```sh
npm run build && npm pack
docker cp n8n-nodes-slideforge-*.tgz sf-n8n:/home/node/.n8n/sf-node.tgz
docker exec -u node sf-n8n sh -c "cd /home/node/.n8n/nodes && npm install /home/node/.n8n/sf-node.tgz"
docker restart sf-n8n
# then, in the slideforge repo:
python scripts/n8n/setup_node_demo.py
python scripts/n8n/run_workflow.py "community node smoke"
```

Last run 2026-08-19: two-slide deck `complete` / `verbatim`, 130 kB `.pptx` returned as binary
named after the job id; the Layout dropdown loaded all 37 layouts.
