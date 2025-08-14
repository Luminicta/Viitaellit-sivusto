<script lang="ts">
  import { slide } from "svelte/transition";
  import { onMount } from "svelte";

  const { dropdownId, label, items, renderLinks = true , description = false } = $props<{
    dropdownId?: Array<string>;
    label: Array<string>;
    items: Array<string | { text: string; href: string }>;
    renderLinks?: boolean;
    description?: boolean;
  }>();
  let isOpen = $state(false);
  let clickedToggle = $state(false);
  
  let wrapper: HTMLDivElement;

  function open() {
    isOpen = true;
  }

  function close() {
    isOpen = false;
    clickedToggle = false;
  }

  function handleMouseEnter() {
    if (!clickedToggle) 
    open();
  }

  function handleMouseLeave() {
    if (!clickedToggle) 
    close();
  }

  function handleClick(e: MouseEvent) {
    e.stopPropagation();
    clickedToggle = !clickedToggle;
    isOpen = clickedToggle;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape" || e.key === "Backspace") {
      e.preventDefault();
      close();
      const btn = wrapper.querySelector<HTMLButtonElement>(".dropdown-button");
      btn?.focus();
    }
  }

  onMount(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (!wrapper.contains(e.target as Node)) {
        close();
      }
    };

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  });
</script>

<div
  class="dropdown-wrapper"
  bind:this={wrapper}
  role="menu"
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  onkeydown={handleKeydown}
  aria-hidden="true"
  
>
  <button
    class="dropdown-button"
    aria-haspopup="true"
    aria-expanded={isOpen}
    onclick={handleClick}
    
  >
    {label}
    <img
      src="/images/dropdown-arrow.svg"
      alt="▼"
      style={`transform: rotate(${isOpen ? 180 : 0}deg); transition: transform 0.2s ease;`}
    />
  </button>

  {#if isOpen}
    {#if description == true}
    <div class="dropdown-description-content" >
      <div class="dropdown-description-text">{items}</div>
    </div>
    {:else}
    <div class="dropdown-content" role="menu">
      {#each items as item}
        {#if typeof item === 'string'}
          {#if renderLinks}
            <a class="dropdown-item link" href="/" role="menuitem" tabindex="0">{item}</a>
          {:else}
            <div class="dropdown-item" role="menuitem" tabindex="-1">{item}</div>
          {/if}
        {:else}
          <a class="dropdown-item" href={item.href || "/"} role="menuitem" tabindex="0">
            {item.text}
          </a>
        {/if}
      {/each}
    </div>
    {/if}
    
  {/if}
</div>

<style>
  .dropdown-wrapper {
    display: inline-block;
    position: relative;
    
  }

  .dropdown-button {
    background: transparent;
    border: none;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: inherit;
    font-family: inherit;
    flex-wrap: nowrap;
    white-space: nowrap;
    width: inherit;
    height: inherit;
  }

  .dropdown-content {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(210, 210, 210, 0.95);
    border-radius: 0 0 20px 20px;
    padding: 0.5rem;
    z-index: 1000;
    min-width: 220px;
    font-size: 85%;
    display: flex;
    flex-direction: column;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 0.25rem;
    overflow-y: auto;
  }

  .dropdown-description-content{
    position: absolute;
    display: flex;
    flex-direction: column;
    background-color: rgb(229, 255, 229);
    min-width: 50vh;
    z-index: 100;
    align-items: center;
    justify-content: center;
    padding: 15px;
    height: inherit;
    left: 50%;
    transform: translateX(-50%);
  }

  .dropdown-item {
    padding: 0.5rem;
    white-space: nowrap;
    text-decoration: none;
    color: inherit;
  }
  .dropdown-item:hover{
    cursor: default;
  }

  .link:hover {
    background: rgba(0, 0, 0, 0.05);
    cursor: pointer;
  }

  .dropdown-item:focus {
    outline: 2px solid #999;
  }
</style>