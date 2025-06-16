<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { slide, fade } from 'svelte/transition';

  const headerHeight = 60;
  let isClickedOpen = $state(false);
  let showDropdown = $state(false);
  let isHovering = $state(false);
  let wrapper: HTMLDivElement;

  const tiedot = [
    { Osoite: "Eeronkatu 10" },
    { Puhelinnumero: "010-271 5010" }
  ];

  const fullWeek = ["ma", "ti", "ke", "to", "pe", "la", "su"];

  const input: { paivat: string[]; aika: { aukeaa?: string | number; sulkeutuu?: string | number } }[] = [
    { paivat: ["ma", "ti", "ke", "pe"], aika: { aukeaa: "8", sulkeutuu: "16" } },
    { paivat: ["to"], aika: { aukeaa: 10, sulkeutuu: 14 } },
    { paivat: ["la", "su"], aika: {} }
  ];

  function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function normalizeTime(value: string | number | undefined): string {
    if (value === undefined || value === null) return "";
    const str = String(value);
    if (/^\d{1,2}:\d{2}$/.test(str)) return str;
    if (/^\d{1,2}$/.test(str)) {
      return `${str.padStart(2, "0")}:00`;
    }
    return str;
  }

  function formatTime({ aukeaa, sulkeutuu }: { aukeaa?: string | number; sulkeutuu?: string | number }): string {
    const open = normalizeTime(aukeaa);
    const close = normalizeTime(sulkeutuu);
    return !open && !close ? "24/7" : `${open}${(open || close) ? " - " : ""}${close}`;
  }

  function groupConsecutiveDays(days: string[]): string {
    const indexes = days
      .map((d) => fullWeek.indexOf(d))
      .filter((i) => i !== -1)
      .sort((a, b) => a - b);

    const result: string[] = [];
    let temp = [indexes[0]];

    for (let i = 1; i < indexes.length; i++) {
      const curr = indexes[i];
      const prev = indexes[i - 1];
      if (curr === prev + 1) {
        temp.push(curr);
      } else {
        result.push(formatRange(temp));
        temp = [curr];
      }
    }

    if (temp.length) {
      result.push(formatRange(temp));
    }

    return result.join(", ");
  }

  function formatRange(indexes: number[]): string {
    const names = indexes.map((i) => capitalize(fullWeek[i]));
    return names.length === 1 ? names[0] : `${names[0]}-${names[names.length - 1]}`;
  }

  function groupDaysByTime(entries: typeof input): string[] {
    const timeMap = new Map<string, string[]>(); // time string → list of days

    for (const entry of entries) {
      const timeStr = formatTime(entry.aika);
      for (const day of entry.paivat) {
        const list = timeMap.get(timeStr) ?? [];
        list.push(day);
        timeMap.set(timeStr, list);
      }
    }

    return Array.from(timeMap.entries()).map(([time, days]) => {
      const uniqueDays = Array.from(new Set(days));
      const formattedDayGroups = groupConsecutiveDays(uniqueDays);
      return `${formattedDayGroups}: ${time}`;
    });
  }

  const ajat: string[] = groupDaysByTime(input);
</script>

<div class="Times">
  {#each ajat as rivi}
    <div>{rivi}</div>
  {/each}
</div>
