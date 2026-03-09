<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { fade, fly } from 'svelte/transition';
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
    searchContent: string;
    iconPath: string;
  }

  export let distros: Distro[] = [];

  let isOpen = false;
  let query = '';
  let selectedIndex = 0;
  let inputElement: HTMLInputElement;
  let resultsElement: HTMLDivElement;
  let lastFocusedElement: HTMLElement | null = null;

  $: filteredResults = query.trim() === '' 
    ? distros.slice(0, 5) 
    : distros.filter(d => d.searchContent.includes(query.toLowerCase()));

  $: if (filteredResults) {
    selectedIndex = 0;
  }

  const openPalette = () => {
    lastFocusedElement = document.activeElement as HTMLElement;
    isOpen = true;
    query = '';
    document.body.style.overflow = 'hidden';
  };

  const closePalette = () => {
    isOpen = false;
    document.body.style.overflow = '';
    if (lastFocusedElement) lastFocusedElement.focus();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (isOpen) closePalette(); else openPalette();
    }
    if (e.key === 'Escape' && isOpen) closePalette();

    if (!isOpen || filteredResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % filteredResults.length;
      scrollToSelected();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + filteredResults.length) % filteredResults.length;
      scrollToSelected();
    } else if (e.key === 'Home') {
      e.preventDefault(); selectedIndex = 0; scrollToSelected();
    } else if (e.key === 'End') {
      e.preventDefault(); selectedIndex = filteredResults.length - 1; scrollToSelected();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredResults[selectedIndex];
      if (selected) window.location.href = `/distros/${selected.slug}`;
    }
  };

  async function scrollToSelected() {
    await tick();
    const selectedItem = resultsElement?.querySelector('.selected');
    if (selectedItem) {
      selectedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  $: if (isOpen && inputElement) {
    tick().then(() => inputElement.focus());
  }
</script>

{#if isOpen}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div 
    class="palette-overlay" 
    on:click|self={closePalette}
    transition:fade={{ duration: 200 }}
  >
    <div 
      class="palette-modal-wrapper"
      transition:fly={{ y: 20, duration: 300, easing: cubicOut }}
    >
      <div id="palette-modal" class="palette-modal" role="dialog" aria-modal="true" aria-labelledby="palette-title">
        <h2 id="palette-title" class="sr-only">Command Palette</h2>
        
        <div class="palette-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="search-icon" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            bind:this={inputElement}
            bind:value={query}
            type="text" 
            placeholder="Search distributions..." 
            autocomplete="off" 
            spellcheck="false"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded="true"
            aria-haspopup="listbox"
            aria-controls="palette-listbox"
            aria-activedescendant="option-{selectedIndex}"
          />
          <div class="palette-hint-esc" aria-hidden="true">ESC</div>
        </div>
        
        <div 
          bind:this={resultsElement}
          id="palette-listbox"
          class="palette-results custom-scrollbar"
          role="listbox"
          aria-label="Search results"
        >
          {#each filteredResults as d, i (d.id)}
            <a 
              href="/distros/{d.slug}" 
              class="palette-item"
              class:selected={i === selectedIndex}
              id="option-{i}"
              role="option"
              aria-selected={i === selectedIndex}
              tabindex="-1"
              style="--distro-color: {d.color || 'var(--primary)'}"
              on:mouseenter={() => selectedIndex = i}
            >
              <div class="item-accent" aria-hidden="true"></div>
              <div class="item-header">
                <div class="item-icon-wrapper" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d={d.iconPath} />
                  </svg>
                </div>
                <div class="item-title-group">
                  <div class="item-name-row">
                    <span class="item-name">{d.name}</span>
                    <span class="item-badge release-{d.release_model}">
                      {d.release_model === 'rolling' ? 'Rolling' : d.release_model === 'fixed' ? 'Fixed' : 'LTS'}
                    </span>
                  </div>
                  <div class="item-tagline">{d.tagline}</div>
                </div>
              </div>
              <div class="item-meta">
                {#if d.based_on}
                  <span class="meta-badge">↗ {d.based_on}</span>
                {/if}
                {#each d.desktop_environments.slice(0, 1) as de}
                  <span class="meta-badge">{de}</span>
                {/each}
                {#each d.use_cases.slice(0, 1) as uc}
                  <span class="meta-badge">{uc}</span>
                {/each}
              </div>
            </a>
          {:else}
            <div class="palette-no-results" role="status">No distributions found for "{query}"</div>
          {/each}
        </div>

        <div class="palette-footer">
          <div class="footer-item">
            <kbd aria-hidden="true">↑</kbd><kbd aria-hidden="true">↓</kbd> <span>Navigate</span>
          </div>
          <div class="footer-item">
            <kbd aria-hidden="true">Enter</kbd> <span>Select</span>
          </div>
          <div class="footer-item">
            <kbd aria-hidden="true">⌘</kbd><kbd aria-hidden="true">K</kbd> <span>Search</span>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .palette-overlay {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(7, 8, 15, 0.5); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    display: flex; justify-content: center; padding-top: 12vh;
  }

  .palette-modal-wrapper { width: 100%; max-width: 600px; padding: 0 1.5rem; }

  .palette-modal {
    background: rgba(14, 16, 24, 0.8); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
    border: 1px solid var(--border); border-radius: var(--radius-xl);
    box-shadow: 0 32px 64px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
    overflow: hidden; display: flex; flex-direction: column;
  }

  .palette-header {
    display: flex; align-items: center; padding: 1.125rem 1.5rem; gap: 1rem;
    border-bottom: 1px solid var(--border-subtle);
  }
  .search-icon { color: var(--text-muted); flex-shrink: 0; }
  input {
    flex: 1; background: transparent; border: none; color: var(--text);
    font-size: 1.1rem; font-family: inherit; outline: none;
  }
  input::placeholder { color: var(--text-subtle); }
  .palette-hint-esc {
    font-size: 0.65rem; font-weight: 700; color: var(--text-subtle);
    padding: 0.2rem 0.4rem; border: 1px solid var(--border); border-radius: 4px;
  }

  .palette-results { max-height: 520px; overflow-y: auto; padding: 0.875rem; display: flex; flex-direction: column; gap: 0.75rem; }
  .custom-scrollbar::-webkit-scrollbar { width: 5px; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }

  .palette-item {
    position: relative; display: flex; flex-direction: column; gap: 0.875rem;
    padding: 1.125rem 1.25rem; border-radius: var(--radius-lg); background: var(--bg-surface);
    border: 1px solid var(--border); text-decoration: none; color: inherit;
    transition: transform var(--transition), border-color var(--transition), background var(--transition);
    overflow: hidden;
  }

  .palette-item.selected {
    background: var(--bg-elevated);
    border-color: var(--distro-color);
    transform: scale(1.01);
  }

  .item-accent {
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: var(--distro-color); opacity: 0.4; transition: opacity var(--transition);
  }
  .palette-item.selected .item-accent { opacity: 1; }

  .item-header { display: flex; align-items: flex-start; gap: 0.875rem; }

  .item-icon-wrapper {
    flex-shrink: 0; width: 2.5rem; height: 2.5rem; border-radius: var(--radius);
    background: color-mix(in srgb, var(--distro-color) 12%, var(--bg-elevated));
    border: 1px solid color-mix(in srgb, var(--distro-color) 30%, transparent);
    display: flex; align-items: center; justify-content: center;
    color: var(--distro-color);
  }

  .item-title-group { flex: 1; min-width: 0; }
  .item-name-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.15rem; }
  .item-name { font-weight: 700; font-size: 0.95rem; color: var(--text); }

  .item-badge {
    font-size: 0.65rem; font-weight: 700; padding: 0.05rem 0.45rem; border-radius: 999px;
    background: var(--bg-elevated); border: 1px solid var(--border);
  }
  :global(.release-rolling) { color: var(--accent); background: var(--accent-dim); border-color: rgba(245, 158, 11, 0.2); }
  :global(.release-lts) { color: var(--accent-green); background: var(--accent-green-dim); border-color: rgba(34, 211, 160, 0.2); }
  :global(.release-fixed) { color: var(--primary); background: var(--primary-dim); border-color: rgba(124, 108, 245, 0.2); }

  .item-tagline {
    font-size: 0.78rem; color: var(--text-muted); line-height: 1.35;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .item-meta { display: flex; flex-wrap: wrap; gap: 0.35rem; }
  .meta-badge {
    font-size: 0.68rem; font-weight: 500; padding: 0.1rem 0.5rem; border-radius: 999px;
    background: var(--bg-elevated); border: 1px solid var(--border-subtle); color: var(--text-muted);
  }

  .palette-footer {
    display: flex; align-items: center; padding: 0.75rem 1.5rem;
    background: rgba(0, 0, 0, 0.2); border-top: 1px solid var(--border-subtle); gap: 1.5rem;
  }
  .footer-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.7rem; color: var(--text-muted); }
  .footer-item kbd {
    background: var(--bg-elevated); border: 1px solid var(--border); color: var(--text-muted);
    border-radius: 4px; padding: 0.1rem 0.35rem; font-size: 0.65rem; font-family: var(--font-mono);
  }

  .palette-no-results { padding: 3rem 2rem; text-align: center; color: var(--text-muted); font-size: 0.9rem; }

  .sr-only {
    position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;
  }

  @media (max-width: 600px) {
    .palette-overlay { padding-top: 0; }
    .palette-modal-wrapper { padding: 0; height: 100%; }
    .palette-modal { height: 100%; border-radius: 0; border: none; }
    .palette-footer { display: none; }
  }
</style>
