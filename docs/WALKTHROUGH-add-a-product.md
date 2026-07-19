# How to add a product

This is the Phase 2 gate (spec §17): you add a test product yourself, without help. If anything
here is confusing or doesn't match what you see, that's a bug in the CMS or in this doc — tell me
which step and I'll fix it. Don't work around it.

**Time:** about 5 minutes.

---

## Before you start

Open **https://run-apparel.hateemjamshaid.workers.dev/admin** and sign in with your usual email
and password. Nothing about your login changed.

Two things you'll notice that are new:

- Your name shows as **"Admin"** in the top corner. Fix it whenever you like: click your name →
  edit the **Full name** field → Save. I deliberately didn't type your name into the database for you.
- There are a lot more things in the left sidebar now — grouped under **Content**, **Catalog**,
  **Buyers** and **Settings**. That's the whole CMS.

---

## Add a product

### 1. Open the form

In the left sidebar, under **Catalog**, click **Products** → **Create New**.

### 2. Fill in the top section

| Field | What to put |
|---|---|
| **Product name** | Anything, e.g. `Test Cycling Jersey`. |
| **URL slug** | Fills in by itself — ignore it. |
| **Category** | Pick one of the five, e.g. *Team Wear*. Required. |
| **Short description** | One sentence. Optional. |
| **Full description** | A paragraph. Optional. |

> **What's a slug?** The address-bar version of the name — `test-cycling-jersey`. It becomes part
> of the product's web address.

### 3. The four tabs

Across the middle you'll see **Specs · Colourways · 3D model · Commercial · SEO**.

- **Specs** — fabric, GSM, sizes, features. *All optional.* Skip it if you like.
- **Colourways** — **you must add at least one.** Click **Add Colourway**, give it a name
  (`Volt`) and a swatch colour (`#CDF345`). The swatch must be a hex colour or it will refuse to save.
- **3D model** — leave it alone. The pipeline fills this in during Phase 4. It defaults to
  "3D coming soon", which is correct for now.
- **Commercial** — leave **Show these publicly** switched OFF. Nothing here appears on the site
  until you confirm real numbers.
- **SEO** — leave blank. We fall back to the title and description.

> **What's GSM?** Grams per square metre — how heavy the fabric is. A t-shirt is ~180, a hoodie ~300.

### 4. Save it

Click **Save Draft** (top right). It saves without publishing — nobody outside can see it.

When you're ready, click **Publish**. Once the public site is built in Phase 3, published products
appear there and drafts don't.

> **Draft vs Published:** a draft is private to this admin panel. Publishing makes it public. You
> can go back to draft at any time.

---

## Did it work?

You should have:

1. The product in the list at **Catalog → Products**, showing your title, category, and a status
   of *Draft* or *Published*.
2. Re-open it — everything you typed is still there.

**That's the gate.** If you got here without me, Phase 2 is done.

---

## Worth a look while you're in there

- **Settings → Site settings** — the WhatsApp number is deliberately fake (`+00-000-0000000`) and
  the button is switched off, so nobody can call it by accident. The "within 2 business days"
  promise and the minimum-order default (250, not shown publicly) live here too.
- **Settings → Market exclusion list** — the six countries we don't take new partnerships from,
  and the message they see. Edit it here and it applies everywhere immediately — the quote form,
  buyer signup, and the contact form all read from this one place. No code change, no deploy.
- **Buyers → Approval queue** — empty for now. When someone signs up for the portal, they land
  here and wait for you to approve or reject them.
- **Catalog → Fabric library** — deliberately empty. It stays empty until you approve the fabric
  and fibre lists in RFQ Plan §16.

---

## Things that are meant to look unfinished

Not bugs — don't report these:

- **Fabric library is empty** — waiting on your §16 approval.
- **Sizes and branding dropdowns** have draft options in them, also from §16 and not yet approved.
- **Categories have no intro text or images** — that copy gets written and approved in Phase 3.
- **Live Preview shows a styled "page not found" screen** — the public site's shell exists now
  (Phase 3), but individual product pages aren't built yet. The wiring is done; there's just no
  product page to preview yet.
- **No emails are sent** — Resend gets connected in Phase 5.

---

## If something goes wrong

Tell me the step number and what you saw. Nothing you do in here can break anything: the site isn't
public yet, and the database is backed up nightly with 30 days of point-in-time restore.
