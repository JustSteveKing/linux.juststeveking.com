<script lang="ts">
  import { onMount } from 'svelte';
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
    package_managers: string[];
    attributes: Record<string, number>;
    iconPath: string;
  }

  export let distros: Distro[] = [];
  
  let selectedAId: string | null = null;
  let selectedBId: string | null = null;

  $: distroA = distros.find(d => d.id === selectedAId) || null;
  $: distroB = distros.find(d => d.id === selectedBId) || null;

  const attributeLabels: Record<string, string> = {
    beginner_friendly: 'UX/Beginner',
    hardware_requirements: 'HW_Specs',
    stability: 'Core_Stability',
    customizability: 'Custom_Depth',
    out_of_box: 'OOBE_Index',
    documentation: 'Doc_Quality',
    community: 'Net_Volume',
    gaming: 'Gaming_Ops',
    development: 'Dev_Tooling',
    privacy: 'Privacy_Vector',
  };

  const attributeKeys = Object.keys(attributeLabels);

  function updateUrl() {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (selectedAId) url.searchParams.set('a', selectedAId); else url.searchParams.delete('a');
    if (selectedBId) url.searchParams.set('b', selectedBId); else url.searchParams.delete('b');
    window.history.replaceState({}, '', url.toString());
  }

  $: if (selectedAId !== undefined || selectedBId !== undefined) { updateUrl(); }

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    selectedAId = params.get('a');
    selectedBId = params.get('b');
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      selectedAId = params.get('a');
      selectedBId = params.get('b');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  });
</script>

<div class="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-8 mb-16">
  <!-- Selector A -->
  <div class="bg-[#0a0a0a] border border-[#222] rounded-2xl p-8 flex flex-col gap-6 transition-all duration-500 shadow-2xl relative overflow-hidden" style="border-top: 4px solid {distroA?.color || '#222'}">
    <div class="absolute top-0 right-0 w-32 h-32 bg-[var(--d-color)] opacity-[0.03] blur-[60px]" style="--d-color: {distroA?.color}"></div>
    <label for="select-a" class="text-[0.65rem] font-mono font-bold uppercase tracking-[0.3em] text-[#444]">NODE_A.select()</label>
    <select id="select-a" class="bg-black border border-[#222] text-white p-4 rounded-xl font-bold text-lg outline-none cursor-pointer focus:border-[var(--accent)] transition-all shadow-inner" bind:value={selectedAId}>
      <option value={null}>Select_Target...</option>
      {#each distros as d}
        <option value={d.id}>{d.name}</option>
      {/each}
    </select>
    {#if distroA}
      <div class="flex items-center gap-5 p-5 bg-white/[0.02] rounded-2xl border border-white/[0.05]" in:fade>
         <div class="w-14 h-14 shrink-0 flex items-center justify-center bg-black border border-[#222] rounded-xl text-[var(--distro-color)] shadow-xl" style="--distro-color: {distroA.color}">
            {#if distroA.iconPath}
              <svg viewBox="0 0 24 24" class="w-7 h-7 fill-current"><path d={distroA.iconPath} /></svg>
            {:else}
              <span class="font-black text-xl">{distroA.name[0]}</span>
            {/if}
         </div>
         <div class="min-w-0">
            <span class="block font-black text-xl text-white tracking-tight">{distroA.name}</span>
            <span class="block text-sm text-[#666] truncate font-medium mt-1">{distroA.tagline}</span>
         </div>
      </div>
    {/if}
  </div>

  <div class="font-mono font-black text-[var(--accent)] text-2xl bg-black w-16 h-16 flex items-center justify-center rounded-2xl border-2 border-[var(--accent)] shadow-[0_0_30px_var(--accent-glow)] max-md:mx-auto text-glow">VS</div>

  <!-- Selector B -->
  <div class="bg-[#0a0a0a] border border-[#222] rounded-2xl p-8 flex flex-col gap-6 transition-all duration-500 shadow-2xl relative overflow-hidden" style="border-top: 4px solid {distroB?.color || '#222'}">
    <div class="absolute top-0 right-0 w-32 h-32 bg-[var(--d-color)] opacity-[0.03] blur-[60px]" style="--d-color: {distroB?.color}"></div>
    <label for="select-b" class="text-[0.65rem] font-mono font-bold uppercase tracking-[0.3em] text-[#444]">NODE_B.select()</label>
    <select id="select-b" class="bg-black border border-[#222] text-white p-4 rounded-xl font-bold text-lg outline-none cursor-pointer focus:border-[var(--accent)] transition-all shadow-inner" bind:value={selectedBId}>
      <option value={null}>Select_Target...</option>
      {#each distros as d}
        <option value={d.id}>{d.name}</option>
      {/each}
    </select>
    {#if distroB}
      <div class="flex items-center gap-5 p-5 bg-white/[0.02] rounded-2xl border border-white/[0.05]" in:fade>
         <div class="w-14 h-14 shrink-0 flex items-center justify-center bg-black border border-[#222] rounded-xl text-[var(--distro-color)] shadow-xl" style="--distro-color: {distroB.color}">
            {#if distroB.iconPath}
              <svg viewBox="0 0 24 24" class="w-7 h-7 fill-current"><path d={distroB.iconPath} /></svg>
            {:else}
              <span class="font-black text-xl">{distroB.name[0]}</span>
            {/if}
         </div>
         <div class="min-w-0">
            <span class="block font-black text-xl text-white tracking-tight">{distroB.name}</span>
            <span class="block text-sm text-[#666] truncate font-medium mt-1">{distroB.tagline}</span>
         </div>
      </div>
    {/if}
  </div>
</div>

{#if distroA && distroB}
  <div class="space-y-12 animate-fade-in" in:fly={{ y: 20, duration: 600, easing: cubicOut }}>
    
    <div class="bg-[#0a0a0a] border border-[#222] rounded-3xl overflow-hidden shadow-2xl">
      <div class="p-8 border-b border-[#222] bg-black/40">
        <h2 class="text-xs font-mono font-bold uppercase tracking-[0.4em] text-[#444] text-center">Differential_Telemetry_Grid</h2>
      </div>
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-black">
            <th class="p-6 text-left text-[0.65rem] font-mono uppercase tracking-widest text-[#444] border-b border-[#222]">Vector</th>
            <th class="p-6 text-left text-xl font-black border-b border-[#222] tracking-tighter" style="color: {distroA.color}">{distroA.name}</th>
            <th class="p-6 text-left text-xl font-black border-b border-[#222] tracking-tighter" style="color: {distroB.color}">{distroB.name}</th>
          </tr>
        </thead>
        <tbody>
          {#each attributeKeys as key}
            <tr class="group hover:bg-white/[0.02] transition-colors">
              <td class="p-5 px-8 border-b border-[#1a1a1a] font-mono text-[0.7rem] uppercase tracking-wider text-[#666] group-hover:text-white transition-colors">{attributeLabels[key]}</td>
              <td class="p-5 px-8 border-b border-[#1a1a1a]">
                <div class="flex items-center gap-4">
                  <div class="flex-1 h-1.5 bg-[#111] rounded-full overflow-hidden max-w-[120px]">
                    <div class="h-full rounded-full transition-all duration-1000" style="width: {distroA.attributes[key] * 20}%; background: {distroA.color}; box-shadow: 0 0 10px {distroA.color}40"></div>
                  </div>
                  <span class="text-xs font-mono text-[#888] font-bold">{distroA.attributes[key]}</span>
                </div>
              </td>
              <td class="p-5 px-8 border-b border-[#1a1a1a]">
                <div class="flex items-center gap-4">
                  <div class="flex-1 h-1.5 bg-[#111] rounded-full overflow-hidden max-w-[120px]">
                    <div class="h-full rounded-full transition-all duration-1000" style="width: {distroB.attributes[key] * 20}%; background: {distroB.color}; box-shadow: 0 0 10px {distroB.color}40"></div>
                  </div>
                  <span class="text-xs font-mono text-[#888] font-bold">{distroB.attributes[key]}</span>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
       <div class="bg-[#0a0a0a] border border-[#222] rounded-2xl p-8 flex flex-col gap-8 shadow-xl">
          <h3 class="text-[0.65rem] font-mono font-bold uppercase tracking-[0.3em] text-[#444]">System_Specs</h3>
          <div class="space-y-6">
            <div class="space-y-3">
              <span class="text-[0.6rem] font-mono text-[#666] uppercase tracking-widest block">Package_Managers</span>
              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-wrap gap-1.5">
                  {#each distroA.package_managers as pm}
                    <code class="px-2 py-1 rounded bg-black border border-[#222] text-[#888] text-[0.65rem] font-mono">{pm}</code>
                  {/each}
                </div>
                <div class="flex flex-wrap gap-1.5">
                  {#each distroB.package_managers as pm}
                    <code class="px-2 py-1 rounded bg-black border border-[#222] text-[#888] text-[0.65rem] font-mono">{pm}</code>
                  {/each}
                </div>
              </div>
            </div>
            <div class="space-y-3">
              <span class="text-[0.6rem] font-mono text-[#666] uppercase tracking-widest block">Core_Architectures</span>
              <div class="grid grid-cols-2 gap-4">
                <div class="p-3 rounded-xl bg-black border border-[#222] text-sm text-white font-bold text-center">
                  {distroA.based_on || 'IND_BASE'}
                </div>
                <div class="p-3 rounded-xl bg-black border border-[#222] text-sm text-white font-bold text-center">
                  {distroB.based_on || 'IND_BASE'}
                </div>
              </div>
            </div>
          </div>
       </div>

       <div class="bg-[#0a0a0a] border border-[#222] rounded-2xl p-8 flex flex-col gap-8 shadow-xl">
          <h3 class="text-[0.65rem] font-mono font-bold uppercase tracking-[0.3em] text-[#444]">UX_Environments</h3>
          <div class="grid grid-cols-2 gap-6">
             <div class="space-y-3">
                <span class="text-[0.6rem] font-mono text-[#666] uppercase tracking-widest text-center block">{distroA.name}</span>
                <ul class="flex flex-col gap-2">
                  {#each distroA.desktop_environments as de}
                    <li class="text-xs p-3 bg-black rounded-xl text-center border border-[#222] text-white font-bold">{de}</li>
                  {/each}
                </ul>
             </div>
             <div class="space-y-3">
                <span class="text-[0.6rem] font-mono text-[#666] uppercase tracking-widest text-center block">{distroB.name}</span>
                <ul class="flex flex-col gap-2">
                  {#each distroB.desktop_environments as de}
                    <li class="text-xs p-3 bg-black rounded-xl text-center border border-[#222] text-white font-bold">{de}</li>
                  {/each}
                </ul>
             </div>
          </div>
       </div>
    </div>

    <div class="flex flex-col sm:flex-row justify-center gap-4 pt-8">
       <a href="/distros/{distroA.slug}" class="px-8 py-3.5 rounded-2xl bg-white text-black font-black text-sm hover:bg-[var(--accent)] hover:shadow-[0_0_30px_var(--accent-glow)] transition-all text-center">EXPLORE_{distroA.name.toUpperCase()}</a>
       <a href="/distros/{distroB.slug}" class="px-8 py-3.5 rounded-2xl bg-[#111] text-white border border-[#222] font-black text-sm hover:border-[var(--accent)] transition-all text-center">EXPLORE_{distroB.name.toUpperCase()}</a>
    </div>
  </div>
{:else}
  <div class="py-32 text-center border-2 border-dashed border-[#222] rounded-3xl opacity-0 animate-fade-in" in:fade>
    <div class="w-20 h-20 rounded-2xl bg-[#0a0a0a] border border-[#222] flex items-center justify-center mx-auto mb-8 shadow-2xl">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#444" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 3v18"/></svg>
    </div>
    <h2 class="text-3xl font-black text-white tracking-tighter mb-4">Initialization_Required</h2>
    <p class="text-[#666] max-w-md mx-auto text-lg font-medium leading-relaxed">Please select two target distributions from the primary nodes above to execute differential analysis.</p>
  </div>
{/if}

<style>
  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
</style>
