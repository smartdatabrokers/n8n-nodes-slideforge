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

## Step 2 — the first version, published by hand

The name has never been published, and **neither the npmjs.com UI nor `npm trust` can configure
trusted publishing for a package that does not exist yet** — npm's own docs are explicit: "The
package you're configuring must already exist on the npm registry." So version one has to come
out some other way, once.

Do it interactively, from this directory (PowerShell):

```powershell
npm login                       # asks for your 2FA code
npm run build
$env:RELEASE_MODE = "true"      # see below
npm publish                     # prompts for a one-time code if 2FA is set to "authorization and writes"
```

`RELEASE_MODE` is not optional. `package.json` sets `prepublishOnly` to `n8n-node prerelease`,
whose entire job is to **block a hand-run `npm publish`** — it exits 1 with "Run `npm run release`
to publish the package" unless that variable is set. `n8n-node release` sets it internally, which
is why the CI path needs nothing. Verified 2026-08-19: without it, `npm publish` fails before it
uploads anything.

Do **not** use `npm run release` for this first version: it would also tag `0.1.0` and push, and
that tag fires the publish workflow, which would then try to publish a version that already
exists.

**Not from a CI token.** A token that can publish unattended is by definition a 2FA-bypass
granular token, and that is precisely the class npm is retiring
([GitHub changelog, 2026-07-08](https://github.blog/changelog/2026-07-08-npm-install-time-security-and-gat-bypass2fa-deprecation/)):
since early August 2026 those tokens can no longer perform sensitive account operations, and from
around January 2027 they lose direct publishing entirely — publishing becomes "staging a publish,
where a package only becomes public after a human 2FA approval". Creating one now means creating a
credential with a known expiry date and a secret living in repo settings. One interactive publish
avoids ever minting it.

**This first version carries no provenance**, so do not submit it to n8n. It exists only so that
step 3 becomes possible.

## Step 3 — Trusted Publishing (OIDC), then the version we actually submit

Either on npmjs.com — the package → Settings → Publish access → Trusted Publishers → Add a
publisher — or from the CLI (needs npm 11.15+; this machine has 11.7, so use `npx npm@latest`):

```sh
npx npm@latest trust github n8n-nodes-slideforge \n  --repo smartdatabrokers/n8n-nodes-slideforge \n  --file publish.yml \n  --allow-publish
```

| Field | Value |
|---|---|
| Provider | GitHub Actions |
| Repository owner | `smartdatabrokers` |
| Repository name | `n8n-nodes-slideforge` |
| Workflow name | `publish.yml` |
| Environment | leave blank |

Account-level 2FA must be on, and the trust command needs an interactive login — a token cannot
set this up.

Then cut the next version through the workflow:

```sh
npm run release        # bump, changelog, commit, tag, push -> the tag publishes
```

**That version is the one we submit** — it is the first with a provenance attestation. No
`NPM_TOKEN` secret is ever created; the workflow falls through to the OIDC exchange when the
secret is absent.

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
