<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { fade, fly, slide } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  interface Distro {
    id: string;
    name: string;
    tagline: string;
    icon_slug: string;
    color: string;
    slug: string;
    based_on?: string;
    release_model: 'rolling' | 'fixed' | 'lts';
    use_cases: string[];
    desktop_environments: string[];
    package_managers: string[];
    attributes: Record<string, number>;
    iconPath: string;
  }

  export let allDistros: Distro[] = [];
  export let initialA: string | null = null;
  export let initialB: string | null = null;

  let selectedAId = initialA;
  let selectedBId = initialB;

  $: distroA = allDistros.find(d => d.id === selectedAId) || null;
  $: distroB = allDistros.find(d => d.id === selectedBId) || null;

  const attributeLabels: Record<string, string> = {
    beginner_friendly: 'Beginner-friendly',
    hardware_requirements: 'Hardware requirements',
    stability: 'Stability',
    customizability: 'Customizability',
    out_of_box: 'Out-of-box',
    documentation: 'Documentation',
    community: 'Community',
    gaming: 'Gaming',
    development: 'Development',
    privacy: 'Privacy',
  };

  const attributeKeys = Object.keys(attributeLabels);

  function updateUrl() {
    const url = new URL(window.location.href);
    if (selectedAId) url.searchParams.set('a', selectedAId); else url.searchParams.delete('a');
    if (selectedBId) url.searchParams.set('b', selectedBId); else url.searchParams.delete('b');
    window.history.replaceState({}, '', url.toString());
  }

  $: if (selectedAId !== undefined || selectedBId !== undefined) {
    if (typeof window !== 'undefined') updateUrl();
  }

  // Handle browser back/forward
  onMount(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      selectedAId = params.get('a');
      selectedBId = params.get('b');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  });
</script>

<div class="selection-grid">
  <!-- Selector A -->
  <div class="selector-card" style="--distro-color: {distroA?.color || 'var(--border)'}">
    <label for="select-a">Distribution A</label>
    <select id="select-a" class="distro-select" bind:value={selectedAId}>
      <option value={null}>Select a distribution...</option>
      {#each allDistros as d}
        <option value={d.id}>{d.name}</option>
      {/each}
    </select>
    {#if distroA}
      <div class="selected-preview" in:fade>
         <div class="preview-icon">
            {#if distroA.iconPath}
              <svg viewBox="0 0 24 24" fill="currentColor"><path d={distroA.iconPath} /></svg>
            {:else}
              <span>{distroA.name[0]}</span>
            {/if}
         </div>
         <div class="preview-text">
            <span class="preview-name">{distroA.name}</span>
            <span class="preview-tagline">{distroA.tagline}</span>
         </div>
      </div>
    {/if}
  </div>

  <div class="vs-divider">VS</div>

  <!-- Selector B -->
  <div class="selector-card" style="--distro-color: {distroB?.color || 'var(--border)'}">
    <label for="select-b">Distribution B</label>
    <select id="select-b" class="distro-select" bind:value={selectedBId}>
      <option value={null}>Select a distribution...</option>
      {#each allDistros as d}
        <option value={d.id}>{d.name}</option>
      {/each}
    </select>
    {#if distroB}
      <div class="selected-preview" in:fade>
         <div class="preview-icon">
            {#if distroB.iconPath}
              <svg viewBox="0 0 24 24" fill="currentColor"><path d={distroB.iconPath} /></svg>
            {:else}
              <span>{distroB.name[0]}</span>
            {/if}
         </div>
         <div class="preview-text">
            <span class="preview-name">{distroB.name}</span>
            <span class="preview-tagline">{distroB.tagline}</span>
         </div>
      </div>
    {/if}
  </div>
</div>

{#if distroA && distroB}
  <div class="comparison-content" in:fly={{ y: 20, duration: 400, easing: cubicOut }}>
    <!-- Attributes Table -->
    <section class="comparison-section">
      <h2 class="section-title">Attribute Comparison</h2>
      <div class="comparison-table-wrapper">
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Attribute</th>
              <th style="color: {distroA.color}">{distroA.name}</th>
              <th style="color: {distroB.color}">{distroB.name}</th>
            </tr>
          </thead>
          <tbody>
            {#each attributeKeys as key}
              <tr>
                <td class="attr-name">{attributeLabels[key]}</td>
                <td>
                  <div class="score-cell">
                    <div class="score-pips">
                      {#each Array(5) as _, i}
                        <span class="pip" class:on={i < distroA.attributes[key]} style="--p-color: {distroA.color}"></span>
                      {/each}
                    </div>
                    <span class="score-num">{distroA.attributes[key]}/5</span>
                  </div>
                </td>
                <td>
                  <div class="score-cell">
                    <div class="score-pips">
                      {#each Array(5) as _, i}
                        <span class="pip" class:on={i < distroB.attributes[key]} style="--p-color: {distroB.color}"></span>
                      {/each}
                    </div>
                    <span class="score-num">{distroB.attributes[key]}/5</span>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </section>

    <!-- Technical Specs -->
    <div class="specs-grid">
       <section class="spec-card">
          <h3>Base System</h3>
          <div class="spec-comparison">
             <div class="spec-val">
                <span class="spec-label">{distroA.name}</span>
                <span class="badge">{distroA.based_on || 'Independent'}</span>
             </div>
             <div class="spec-val">
                <span class="spec-label">{distroB.name}</span>
                <span class="badge">{distroB.based_on || 'Independent'}</span>
             </div>
          </div>
       </section>

       <section class="spec-card">
          <h3>Release Model</h3>
          <div class="spec-comparison">
             <div class="spec-val">
                <span class="spec-label">{distroA.name}</span>
                <span class="badge">{distroA.release_model.toUpperCase()}</span>
             </div>
             <div class="spec-val">
                <span class="spec-label">{distroB.name}</span>
                <span class="badge">{distroB.release_model.toUpperCase()}</span>
             </div>
          </div>
       </section>

       <section class="spec-card">
          <h3>Desktop Environments</h3>
          <div class="spec-comparison-cols">
             <div class="spec-col">
                <span class="spec-label">{distroA.name}</span>
                <ul class="spec-list">
                  {#each distroA.desktop_environments as de}
                    <li>{de}</li>
                  {/each}
                </ul>
             </div>
             <div class="spec-col">
                <span class="spec-label">{distroB.name}</span>
                <ul class="spec-list">
                  {#each distroB.desktop_environments as de}
                    <li>{de}</li>
                  {/each}
                </ul>
             </div>
          </div>
       </section>

       <section class="spec-card">
          <h3>Package Managers</h3>
          <div class="spec-comparison-cols">
             <div class="spec-col">
                <span class="spec-label">{distroA.name}</span>
                <div class="tags">
                  {#each distroA.package_managers as pm}
                    <code class="pm-code">{pm}</code>
                  {/each}
                </div>
             </div>
             <div class="spec-col">
                <span class="spec-label">{distroB.name}</span>
                <div class="tags">
                  {#each distroB.package_managers as pm}
                    <code class="pm-code">{pm}</code>
                  {/each}
                </div>
             </div>
          </div>
       </section>
    </div>

    <div class="actions-footer">
       <a href="/distros/{distroA.slug}" class="btn btn-outline">Explore {distroA.name}</a>
       <a href="/distros/{distroB.slug}" class="btn btn-outline">Explore {distroB.name}</a>
    </div>
  </div>
{:else}
  <div class="empty-state" in:fade>
    <div class="empty-illustration">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-columns-2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 3v18"/></svg>
    </div>
    <h2>Select two distributions to compare</h2>
    <p>Choose from the dropdowns above to see a side-by-side analysis of features, attributes, and technical specs.</p>
  </div>
{/if}

<style>
  /* ── Selection Grid ── */
  .selection-grid {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 2rem;
    margin-bottom: 4rem;
  }

  .selector-card {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition: border-color var(--transition);
    border-top: 3px solid var(--distro-color, var(--border));
  }

  .selector-card label {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-subtle);
  }

  .distro-select {
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 0.75rem;
    border-radius: var(--radius);
    font-family: inherit;
    font-size: 0.95rem;
    outline: none;
    cursor: pointer;
  }

  .distro-select:focus {
    border-color: var(--primary);
  }

  .vs-divider {
    font-family: var(--font-mono);
    font-weight: 800;
    color: var(--text-subtle);
    font-size: 1.25rem;
    background: var(--bg-elevated);
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 1px solid var(--border);
  }

  .selected-preview {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.02);
    border-radius: var(--radius-lg);
  }

  .preview-icon {
    width: 2.5rem;
    height: 2.5rem;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-elevated);
    border-radius: var(--radius);
    color: var(--distro-color, var(--text-muted));
  }
  .preview-icon svg { width: 20px; height: 20px; }

  .preview-text { min-width: 0; }
  .preview-name { display: block; font-weight: 700; font-size: 0.95rem; }
  .preview-tagline { display: block; font-size: 0.75rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  /* ── Comparison Table ── */
  .comparison-section {
    margin-bottom: 4rem;
  }

  .section-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    text-align: center;
    color: var(--text-muted);
  }

  .comparison-table-wrapper {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    overflow: hidden;
  }

  .comparison-table {
    width: 100%;
    border-collapse: collapse;
  }

  .comparison-table th {
    background: rgba(0, 0, 0, 0.2);
    padding: 1.25rem;
    text-align: left;
    font-size: 1rem;
    font-weight: 800;
    border-bottom: 1px solid var(--border);
  }

  .comparison-table td {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border-subtle);
  }

  .attr-name {
    font-weight: 600;
    color: var(--text-muted);
    font-size: 0.9rem;
    width: 200px;
  }

  .score-cell {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .score-pips { display: flex; gap: 4px; }
  .pip {
    width: 12px; height: 6px; border-radius: 2px;
    background: var(--bg-elevated);
  }
  .pip.on { background: var(--p-color, var(--primary)); }
  .score-num { font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-subtle); }

  /* ── Specs Grid ── */
  .specs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 4rem;
  }

  .spec-card {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 1.5rem;
  }

  .spec-card h3 {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-subtle);
    margin-bottom: 1.25rem;
    text-align: center;
  }

  .spec-comparison {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .spec-val {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0.75rem;
    background: var(--bg-elevated);
    border-radius: var(--radius);
  }

  .spec-label { font-size: 0.85rem; font-weight: 600; }

  .spec-comparison-cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .spec-col { display: flex; flex-direction: column; gap: 0.5rem; }
  .spec-col .spec-label { color: var(--text-subtle); font-size: 0.7rem; text-transform: uppercase; margin-bottom: 0.25rem; text-align: center;}

  .spec-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .spec-list li { font-size: 0.85rem; padding: 0.35rem; background: var(--bg-elevated); border-radius: 4px; text-align: center; }

  .pm-code {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    display: block;
    margin-bottom: 0.25rem;
    background: var(--bg-elevated);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    text-align: center;
    color: var(--accent);
  }

  /* ── Empty State ── */
  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    background: var(--bg-surface);
    border: 2px dashed var(--border);
    border-radius: var(--radius-xl);
  }

  .empty-illustration {
    margin-bottom: 1.5rem;
    color: var(--text-subtle);
  }

  .empty-state h2 { margin-bottom: 0.75rem; }
  .empty-state p { color: var(--text-muted); max-width: 400px; margin: 0 auto; }

  .actions-footer {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  .tags { display: flex; flex-direction: column; align-items: center; }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.2rem 0.65rem;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.01em;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    color: var(--text-muted);
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    .selection-grid { grid-template-columns: 1fr; }
    .vs-divider { margin: 0 auto; }
    .comparison-table th { font-size: 0.85rem; }
    .attr-name { width: 120px; font-size: 0.8rem; }
  }
</style>
