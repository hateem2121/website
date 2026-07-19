/**
 * Drafted copy for the five category landing pages (spec §5 /catalog/[category], spec §12: the
 * five category pages are the primary keyword landers — "substantial CMS copy, not thin grids").
 *
 * DRAFT status: this is the fallback the pages render until each category's CMS `intro` is written
 * (Categories.intro — "Left blank until the Phase 3 copy review"). Once Hateem approves a lander,
 * its copy moves into the CMS and overrides these paragraphs. Facts come from the Company Master
 * Prompt ("What We Make" + facility figures); keyword angles from spec §12.
 */

export type CategoryCopy = {
  /** Keyword H1 (spec §12 lander) — the category name itself stays in the label/breadcrumb. */
  h1: string
  /** Serif-accented tail of the H1, kept separate so the layout can style it. */
  h1Accent: string
  metaTitle: string
  metaDescription: string
  intro: string[]
  /** The concrete article types this family covers — from "What We Make". */
  items: string[]
  /** Category-specific reasons-to-buy, each backed by a Company Master Prompt fact. */
  points: { title: string; body: string }[]
}

export const CATEGORY_COPY: Record<string, CategoryCopy> = {
  'team-wear': {
    h1: 'Custom team wear,',
    h1Accent: 'made to match your game.',
    metaTitle: 'Custom Team Wear Manufacturer — Cycling, Soccer, Tennis & Wetsuits',
    metaDescription:
      'B2B custom team wear manufacturer in Sialkot: cycling, tennis, American football, soccer and surf uniforms, plus a full Wetsuit Edition line. Made to order, certified-supplier fabrics.',
    intro: [
      'Team wear is where identity meets performance: the kit has to survive a season of laundry cycles and collisions, and it has to look unmistakably like your team, not a template with your logo dropped in. RUN APPAREL manufactures custom uniforms for cycling, tennis, American football, soccer and surf — cut, sewn and sublimation-printed to your design in our Sialkot facility.',
      'The same line carries our Wetsuit Edition: custom wetsuit and water-sports manufacturing for dive centers, surf schools and beach brands — scuba suits, surfing suits, beachwear and cropped swimwear. It is a different construction discipline (neoprene behaves nothing like knit polyester), handled by the same five-stage, checkpoint-gated process.',
      'Every programme is made to order. Send your tech pack, or start from an idea and let our CLO3D prototyping team engineer the garment with you before a metre of fabric is cut.',
    ],
    items: [
      'Cycling jerseys, bibs & skinsuits',
      'Soccer & American football kits',
      'Tennis match wear',
      'Surf & rash guard uniforms',
      'Wetsuit Edition: scuba & surfing suits',
      'Beachwear & cropped swimwear',
    ],
    points: [
      {
        title: 'Colour that outlives the season',
        body: 'All-over sublimation dyes your design into the fibre — team colours that don’t crack, peel or fade through a season of washing.',
      },
      {
        title: 'Fit engineered per sport',
        body: 'Biomechanical panel placement — a cycling jersey and a football kit stretch in different places, and their patterns should too.',
      },
      {
        title: 'Squad to league scale',
        body: 'From a single club’s kit to 100,000+ units a month, with the same 5+ QC checkpoints on every run.',
      },
    ],
  },
  'active-wear': {
    h1: 'Activewear manufacturing,',
    h1Accent: 'built for movement.',
    metaTitle: 'Private Label Activewear Manufacturer — Sports Bras, Tops & Bodysuits',
    metaDescription:
      'Private label activewear manufacturer in Sialkot: sports bras, athletic tops and bottoms, and full body suits — made to order from GOTS-, OEKO-TEX- and RCS-certified supplier fabrics.',
    intro: [
      'Activewear is the most technically unforgiving category we make: compression has to hold without strangling, seams have to disappear against skin, and fabric has to move moisture for an hour without chafing. RUN APPAREL manufactures private-label activewear — sports bras, athletic tops, athletic bottoms and full body suits — for brands that sell performance, not just aesthetics.',
      'Construction is flatlock- and coverstitch-led for next-to-skin comfort, with fabrics sourced exclusively from GOTS-, OEKO-TEX- and RCS-certified suppliers. If your label makes sustainability claims, we can back them with supplier certificates rather than adjectives.',
      'Minimums are flexible and colour matching is unlimited — your palette, your blocks, your labels. This is manufacturing for brands building a line, not buying a template.',
    ],
    items: [
      'Sports bras — light to high support',
      'Athletic tops & training tees',
      'Leggings, shorts & athletic bottoms',
      'Full body suits & compression pieces',
    ],
    points: [
      {
        title: 'Next-to-skin construction',
        body: 'Flatlock seams and clean interior finishing where garments live against skin at heart rate.',
      },
      {
        title: 'Certified-supplier fabrics',
        body: 'GOTS, OEKO-TEX and RCS certificates held at the mill and verifiable at source — claims your customers can check.',
      },
      {
        title: 'True private label',
        body: 'Your brand on the neck label, hang tag and packaging. 100% B2B — we never compete with your line.',
      },
    ],
  },
  'casual-wear': {
    h1: 'Casual wear,',
    h1Accent: 'cut to your brand.',
    metaTitle: 'Custom Casual Wear Manufacturer — Tees, Hoodies, Polos & Tracksuits',
    metaDescription:
      'Custom casual wear manufacturer in Sialkot: T-shirts, polos, sweatshirts, hoodies and tracksuits, made to order for brands, teams and corporate programmes. Flexible minimums.',
    intro: [
      'The casual range is where most programmes actually live day to day — the hoodie the team travels in, the polo the staff wears, the tee that carries the sponsor. RUN APPAREL manufactures T-shirts, polos, sweatshirts, hoodies and tracksuits to your spec: your fabric weight, your fit block, your branding method.',
      'Because we are a manufacturer rather than a decorator, you choose the construction, not just the print: fabric composition and GSM, ribbing, lining, stitch types, embroidery or sublimation or both. The result reads as a designed garment, not a blank with a logo.',
      'Corporate wellness programmes, team travel wear, merch lines and retail collections all run through the same five-stage process with the same QC gates as our performance wear.',
    ],
    items: [
      'T-shirts & long sleeves',
      'Polos',
      'Sweatshirts & hoodies',
      'Tracksuits & jogger sets',
    ],
    points: [
      {
        title: 'Your block, not a blank',
        body: 'Custom fit, fabric and trim — built from your tech pack or developed with you in 3D before sampling.',
      },
      {
        title: 'Branding done properly',
        body: 'Precision embroidery, sublimation, woven and tagless labels, custom packaging — decided garment by garment.',
      },
      {
        title: 'One supplier, whole programme',
        body: 'Pair the casual range with your team wear or activewear order and keep colour, sizing and delivery under one roof.',
      },
    ],
  },
  'outer-wear': {
    h1: 'Outerwear,',
    h1Accent: 'engineered for the elements.',
    metaTitle: 'Custom Outerwear Manufacturer — Windbreakers, Puffers, Ski & Leather',
    metaDescription:
      'Custom outerwear manufacturer in Sialkot: windbreakers, Sherpa jackets, puffer jackets, ski wear and leather jackets — made to order with reinforced, weather-ready construction.',
    intro: [
      'Outerwear is construction-heavy manufacturing: bonded seams, insulation control, zip engineering, storm flaps — the details that decide whether a jacket works in weather or just photographs well. RUN APPAREL manufactures windbreakers, Sherpa jackets, puffer jackets, ski wear and leather jackets to order.',
      'Leather is not a sideline for us — working hide is where this family’s craft began in 1889, and it remains an in-house discipline alongside modern technical shells. Reinforced construction and seam finishing are standard, verified at the assembly checkpoint on every run.',
      'Whether it is a team’s sideline jacket, a retail puffer line or branded ski wear for a resort programme, the garment is engineered in 3D first, then sampled and produced against your approval.',
    ],
    items: [
      'Windbreakers & shell jackets',
      'Sherpa & fleece jackets',
      'Puffer jackets & insulated pieces',
      'Ski wear',
      'Leather jackets',
    ],
    points: [
      {
        title: 'Construction first',
        body: 'Reinforced seams, storm-ready details and insulation handled at the pattern stage — not patched on later.',
      },
      {
        title: 'A leather lineage',
        body: 'The founding craft of 1889 — leather work remains in-house, five generations on.',
      },
      {
        title: 'Weather-tested materials',
        body: 'Incoming fabric lab checks (colorfastness, shrinkage, tensile strength) before any shell reaches the floor.',
      },
    ],
  },
  'sports-accessories': {
    h1: 'Sports accessories,',
    h1Accent: 'down to the last stitch.',
    metaTitle: 'Custom Sports Accessories Manufacturer — Gloves, Belts, Caps & More',
    metaDescription:
      'Custom sports accessories manufacturer in Sialkot: performance gloves, weight belts, wristbands, caps and branded gear — made to order to complete your programme.',
    intro: [
      'Accessories finish a programme: the gloves that match the kit, the cap that carries the sponsor, the weight belt with your brand debossed in it. RUN APPAREL manufactures performance gloves, weight belts, wristbands, caps and similar branded gear — the small pieces, made with the same seriousness as the garments.',
      'These are high-touch, high-wear items, which is why they benefit most from a manufacturer with materials range: leather, technical knits and webbing all live under one roof here, with the same incoming-material checks and final AQL inspection as everything else we ship.',
      'Most accessories run one-size, which makes them the simplest entry point into working with us — a fast way to test our quality before committing a full apparel programme.',
    ],
    items: [
      'Performance & training gloves',
      'Weight belts',
      'Wristbands & sweatbands',
      'Caps & headwear',
      'Branded gear & programme extras',
    ],
    points: [
      {
        title: 'Materials range',
        body: 'Leather, knit and webbing in one facility — accessories draw on the family’s original craft.',
      },
      {
        title: 'Same QC, smaller canvas',
        body: 'AQL final inspection applies to a wristband exactly as it does to a 10,000-piece kit order.',
      },
      {
        title: 'Low-risk first order',
        body: 'A natural pilot: prove the partnership on accessories, then scale into apparel.',
      },
    ],
  },
}

/** Drafted one-line descriptors for category cards (shared with Home's showcase). */
export const CATEGORY_BLURB: Record<string, string> = {
  'team-wear': 'Cycling, tennis, football, soccer and surf kits — plus the Wetsuit Edition line.',
  'active-wear': 'Sports bras, athletic tops and bottoms, and full body suits.',
  'casual-wear': 'T-shirts, polos, sweatshirts, hoodies and tracksuits.',
  'outer-wear': 'Windbreakers, Sherpa and puffer jackets, ski wear and leather.',
  'sports-accessories': 'Performance gloves, weight belts, wristbands, caps and branded gear.',
}
