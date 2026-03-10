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

  const suggestedSlugs = ['ubuntu', 'arch-linux', 'fedora', 'linux-mint', 'nixos'];
  $: suggestedDistros = distros.filter(d => suggestedSlugs.includes(d.slug));

  let isOpen = false;
  let query = '';
  let selectedIndex = 0;
  let inputElement: HTMLInputElement;
  let resultsElement: HTMLDivElement;
  let lastFocusedElement: HTMLElement | null = null;

  $: filteredResults = query.trim() === '' 
    ? suggestedDistros
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
    class="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-md flex justify-center pt-[15vh]" 
    on:click|self={closePalette}
    transition:fade={{ duration: 200 }}
  >
    <div 
      class="w-full max-w-[640px] px-6"
      transition:fly={{ y: -20, duration: 400, easing: cubicOut }}
    >
      <div class="bg-[#0a0a0a] border border-[#222] rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.05)] overflow-hidden flex flex-col max-h-[70vh]">
        
        <div class="flex items-center p-6 gap-4 border-b border-[#222]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            bind:this={inputElement}
            bind:value={query}
            type="text" 
            placeholder="Search Registry..." 
            class="flex-1 bg-transparent border-none text-white text-lg font-bold outline-none placeholder:text-[#444] tracking-tight"
          />
          <div class="text-[0.65rem] font-mono font-bold text-[#444] px-2 py-1 border border-[#222] rounded-lg">ESC</div>
        </div>
        
        <div 
          bind:this={resultsElement}
          class="overflow-y-auto p-3 flex flex-col gap-1 custom-scrollbar"
          role="listbox"
        >
          {#if query.trim() === '' && filteredResults.length > 0}
            <div class="px-4 py-3 text-[0.65rem] font-mono font-bold uppercase tracking-[0.3em] text-[#444]">Suggested_Nodes</div>
          {/if}

          {#each filteredResults as d, i (d.id)}
            <a 
              href="/distros/{d.slug}" 
              class="flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group"
              class:selected={i === selectedIndex}
              on:mouseenter={() => selectedIndex = i}
              style="--distro-color: {d.color}"
            >
              <div class="shrink-0 w-10 h-10 rounded-xl bg-black border border-[#222] flex items-center justify-center text-white group-hover:text-[var(--distro-color)] group-[.selected]:border-[var(--distro-color)] transition-colors duration-300">
                {#if d.iconPath}
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d={d.iconPath} /></svg>
                {:else}
                  <span class="font-black text-lg">{d.name[0]}</span>
                {/if}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-white group-hover:text-[var(--distro-color)] transition-colors">{d.name}</span>
                  <span class="text-[0.6rem] font-mono font-bold uppercase tracking-widest text-[#444] px-1.5 py-0.5 rounded border border-[#222]">{d.release_model}</span>
                </div>
                <div class="text-sm text-[#666] truncate mt-0.5">{d.tagline}</div>
              </div>
              <div class="text-[var(--accent)] font-mono text-xs opacity-0 group-[.selected]:opacity-100 transition-opacity">EXEC →</div>
            </a>
          {:else}
            <div class="py-20 text-center flex flex-col items-center gap-4">
              <p class="text-[#444] font-mono text-xs uppercase tracking-[0.2em] font-bold">Error: Null_Reference "{query}"</p>
            </div>
          {/each}
        </div>

        <div class="flex items-center p-4 px-6 bg-black/40 border-t border-[#222] gap-6 text-[0.65rem] font-mono font-bold text-[#444] uppercase tracking-widest">
          <div class="flex items-center gap-2">
            <span class="p-1 rounded bg-black border border-[#222]">↑↓</span> <span>Navigate</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="p-1 rounded bg-black border border-[#222]">ENTER</span> <span>Access</span>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .selected {
    background-color: rgba(255, 255, 255, 0.03);
    transform: translateX(4px);
  }
  
  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
</style>
