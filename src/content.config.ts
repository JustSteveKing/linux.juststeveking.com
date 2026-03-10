import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const distroSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  website: z.string().url(),
  based_on: z.string().optional(),
  release_model: z.enum(['rolling', 'fixed', 'lts']),

  /**
   * All numeric attributes are scored 1–5.
   * Higher is "more" of that quality.
   */
  attributes: z.object({
    /** 1 = steep learning curve, 5 = very easy for newcomers */
    beginner_friendly: z.number().min(1).max(5),
    /** 1 = runs on a potato, 5 = needs modern/powerful hardware */
    hardware_requirements: z.number().min(1).max(5),
    /** 1 = bleeding-edge / may break, 5 = rock-solid */
    stability: z.number().min(1).max(5),
    /** 1 = opinionated, 5 = configure everything */
    customizability: z.number().min(1).max(5),
    /** 1 = lots of manual setup, 5 = works great from first boot */
    out_of_box: z.number().min(1).max(5),
    /** Quality and coverage of official documentation */
    documentation: z.number().min(1).max(5),
    /** Size and activity of the community */
    community: z.number().min(1).max(5),
    /** Gaming driver/compatibility support */
    gaming: z.number().min(1).max(5),
    /** Dev tools, language runtimes, IDE support */
    development: z.number().min(1).max(5),
    /** Privacy-by-default posture, telemetry, data collection */
    privacy: z.number().min(1).max(5),
  }),

  desktop_styles: z.array(
    z.enum(['windows-like', 'mac-like', 'minimal', 'traditional', 'tiling', 'unique', 'console'])
  ),
  package_managers: z.array(z.string()),
  desktop_environments: z.array(z.string()),
  use_cases: z.array(
    z.enum(['general', 'gaming', 'development', 'security', 'server', 'privacy', 'education', 'creative', 'infrastructure'])
  ),

  /** Accent colour used in the UI (hex) */
  color: z.string().optional(),
  /** simple-icons slug — used to render the brand SVG logo */
  icon_slug: z.string().optional(),
  /** Latest stable version string, e.g. "24.04 LTS" or "41" */
  version: z.string().optional(),
  /** Human-readable release month/year, e.g. "April 2024" */
  released: z.string().optional(),
});

const distros = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/distros' }),
  schema: distroSchema,
});

export const collections = { distros };
