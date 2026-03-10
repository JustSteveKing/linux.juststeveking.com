import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';

const OUTPUT_DIR = path.resolve('public/og');
const FONT_PATH = path.resolve('scripts/JetBrainsMono-Bold.ttf');

async function generateOG() {
  console.log('🚀 Initializing OG Image Generation...');

  // Ensure output directory exists
  await fs.ensureDir(OUTPUT_DIR);

  // Read local font
  console.log('📥 Reading JetBrainsMono font...');
  const fontData = await fs.readFile(FONT_PATH);
  console.log(`📦 Font data read: ${fontData.byteLength} bytes`);

  // Define static pages
  const staticPages = [
    { slug: 'index', title: 'Linux OS Discovery & Algorithmic Matching', tagline: 'The ultimate engine to find your perfect Linux distribution.' },
    { slug: 'distros', title: 'Explore All Linux Distributions', tagline: 'Browse our comprehensive registry of analyzed distributions.' },
    { slug: 'finder', title: 'Find Your Perfect Linux Distribution', tagline: 'Initialize the algorithmic matching sequence.' },
    { slug: 'compare', title: 'Compare Linux Distributions Side-by-Side', tagline: 'Execute differential analysis between operating systems.' },
  ];

  // Get all distros from content collection
  const distroFiles = await glob('src/content/distros/*.json');
  const distros = await Promise.all(
    distroFiles.map(async (file) => {
      const content = await fs.readJson(file);
      return {
        slug: path.basename(file, '.json'),
        name: content.name,
        tagline: content.tagline,
        color: content.color || '#00ff66',
        attributes: content.attributes,
      };
    })
  );

  const items = [
    ...staticPages.map(p => ({ ...p, type: 'page' })),
    ...distros.map(d => ({ slug: d.slug, title: d.name, tagline: d.tagline, color: d.color, attributes: d.attributes, type: 'distro' }))
  ];

  for (const item of items) {
    for (const mode of ['dark', 'light']) {
      console.log(`📸 Generating ${mode} OG for: ${item.slug}`);
      
      const isDark = mode === 'dark';
      const bgColor = isDark ? '#050505' : '#fcfcfc';
      const textColor = isDark ? '#ffffff' : '#000000';
      const mutedColor = isDark ? '#888888' : '#666666';
      const surfaceColor = isDark ? '#0a0a0a' : '#ffffff';
      const borderColor = isDark ? '#1a1a1a' : '#eaeaea';
      const accentColor = item.color || '#00ff66';

      const svg = await satori(
        {
          type: 'div',
          props: {
            style: {
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              backgroundColor: bgColor,
              padding: '80px',
              fontFamily: 'JetBrains Mono',
              position: 'relative',
            },
            children: [
              // Top accent
              {
                type: 'div',
                props: {
                  style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '12px',
                    backgroundColor: accentColor,
                    display: 'flex',
                  }
                }
              },
              // Header
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '24px',
                          color: accentColor,
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          letterSpacing: '0.2em',
                          display: 'flex',
                        },
                        children: item.type === 'distro' ? 'DISTRO_PROFILE_v5.0' : 'SYSTEM_NODE_v5.0'
                      }
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '80px',
                          color: textColor,
                          fontWeight: 900,
                          lineHeight: 1,
                          letterSpacing: '-0.04em',
                          display: 'flex',
                        },
                        children: item.title.toUpperCase()
                      }
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '32px',
                          color: mutedColor,
                          fontWeight: 500,
                          marginTop: '8px',
                          display: 'flex',
                        },
                        children: item.tagline
                      }
                    }
                  ]
                }
              },
              // Stats for distros
              item.type === 'distro' && {
                type: 'div',
                props: {
                  style: {
                    marginTop: '60px',
                    display: 'flex',
                    gap: '40px',
                    padding: '40px',
                    backgroundColor: surfaceColor,
                    border: `2px solid ${borderColor}`,
                    borderRadius: '24px',
                    width: '100%',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
                        children: [
                          { type: 'div', props: { style: { fontSize: '18px', color: mutedColor, fontWeight: 'bold', display: 'flex' }, children: 'STABILITY' } },
                          {
                            type: 'div',
                            props: {
                              style: { height: '16px', width: '100%', backgroundColor: isDark ? '#111' : '#eee', borderRadius: '8px', overflow: 'hidden', display: 'flex' },
                              children: [
                                { type: 'div', props: { style: { height: '100%', width: `${item.attributes.stability * 20}%`, backgroundColor: accentColor, display: 'flex' } } }
                              ]
                            }
                          }
                        ]
                      }
                    },
                    {
                      type: 'div',
                      props: {
                        style: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
                        children: [
                          { type: 'div', props: { style: { fontSize: '18px', color: mutedColor, fontWeight: 'bold', display: 'flex' }, children: 'UX_FRIENDLY' } },
                          {
                            type: 'div',
                            props: {
                              style: { height: '16px', width: '100%', backgroundColor: isDark ? '#111' : '#eee', borderRadius: '8px', overflow: 'hidden', display: 'flex' },
                              children: [
                                { type: 'div', props: { style: { height: '100%', width: `${item.attributes.beginner_friendly * 20}%`, backgroundColor: accentColor, display: 'flex' } } }
                              ]
                            }
                          }
                        ]
                      }
                    }
                  ]
                }
              },
              // Footer
              {
                type: 'div',
                props: {
                  style: {
                    position: 'absolute',
                    bottom: '60px',
                    left: '80px',
                    fontSize: '20px',
                    color: mutedColor,
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  },
                  children: [
                    { type: 'div', props: { style: { width: '12px', height: '12px', backgroundColor: accentColor, borderRadius: '2px', display: 'flex' } } },
                    { type: 'div', props: { style: { display: 'flex' }, children: `root@distrofind:~# access --target=${item.slug}` } }
                  ]
                }
              }
            ].filter(Boolean) as any[]
          }
        },
        {
          width: 1200,
          height: 630,
          fonts: [
            {
              name: 'JetBrains Mono',
              data: fontData,
              weight: 700,
              style: 'normal',
            },
          ],
        }
      );

      const resvg = new Resvg(svg, {
        fitTo: {
          mode: 'width',
          value: 1200,
        },
      });

      const pngData = resvg.render();
      const pngBuffer = pngData.asPng();

      const fileName = `${item.slug}-${mode}.png`;
      await fs.writeFile(path.join(OUTPUT_DIR, fileName), pngBuffer);
    }
  }

  console.log('✅ OG Image Generation Complete!');
}

generateOG().catch(console.error);
