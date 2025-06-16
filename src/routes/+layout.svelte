<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { slide, fade } from "svelte/transition";
    let { children } = $props();
    const headerHeight = 60;
    let isClickedOpen = $state(false);
    let showDropdown = $state(false);
    let isHovering = $state(false);
    let wrapper: HTMLDivElement;
    let dropdowns = $state({
        hours: false,
        services: false
    });

    const napit = [
        "etusivu",
        "palvelut",
        "hinnasto",
        "henkilökunta",
        "yhteystiedot",
        "artikkelit",
    ];
    const palvelut = [
        "Ruoka- ja tarvikemyynti",
        "Akuutti sairastuminen",
        "Anestesia",
        "Eksoottiset lemmikit",
        "Eutanasia",
        "Geenitestit",
        "Hammas- ja suuhoito",
        "Ihosairaudet ja allergiat",
        "Kirurgia",
        "Laboratoriotutkimukset",
        "Loishoidot",
        "Rokotukset",
        "Röntgentutkimukset",
        "Silmäsairaudet",
        "Sisätaudit",
        "Synnytys",
        "Terveystarkastukset",
        "Tähystystutkimukset",
        "Ultraäänitutkimukset",
        "Viralliset tutkimukset",
    ];

    const tiedot = [
        { Osoite: "Eeronkatu 10" },
        { Puhelinnumero: "010-271 5010" },
    ];

    const fullWeek = ["ma", "ti", "ke", "to", "pe", "la", "su"];

    const input: {
        paivat: string[];
        aika: { aukeaa?: string | number; sulkeutuu?: string | number };
    }[] = [
        {
            paivat: ["ma", "ti", "ke", "pe"],
            aika: { aukeaa: "8", sulkeutuu: "16" },
        },
        { paivat: ["to"], aika: { aukeaa: 10, sulkeutuu: 14 } },
        { paivat: ["la", "su"], aika: {} },
    ];
    let hoursWrapper: HTMLDivElement;

    function getTodayOpeningTime(): string {
        const todayIndex = new Date().getDay();
        const svelteWeekMap = [6, 0, 1, 2, 3, 4, 5];
        const today = fullWeek[svelteWeekMap[todayIndex]];

        for (const entry of input) {
            if (entry.paivat.includes(today)) {
                const { aukeaa, sulkeutuu } = entry.aika;
                if (aukeaa == null && sulkeutuu == null) return "Kiinni";
                return formatTime(entry.aika);
            }
        }

        return "Kiinni";
    }

    const tänään = "Tänään";
    const tänäänAuki = getTodayOpeningTime();

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

    function formatTime({
        aukeaa,
        sulkeutuu,
    }: {
        aukeaa?: string | number;
        sulkeutuu?: string | number;
    }): string {
        const open = normalizeTime(aukeaa);
        const close = normalizeTime(sulkeutuu);
        return !open && !close
            ? "24/7"
            : `${open}${open || close ? " - " : ""}${close}`;
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
        return names.length === 1
            ? names[0]
            : `${names[0]}-${names[names.length - 1]}`;
    }

    function groupDaysByTime(entries: typeof input): string[] {
        const timeMap = new Map<string, string[]>();
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

    function handleMouseEnter(key: keyof typeof dropdowns) {
        if (!isClickedOpen) dropdowns[key] = true;
    }

    function handleMouseLeave(key: keyof typeof dropdowns) {
        if (!isClickedOpen) dropdowns[key] = false;
    }

    function handleClick(event: MouseEvent, key: keyof typeof dropdowns) {
        event.stopPropagation();
        isClickedOpen = !isClickedOpen;
        dropdowns[key] = isClickedOpen;
    }

    /*function handleKeydown(event: KeyboardEvent, key: keyof typeof dropdowns) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            isClickedOpen = !isClickedOpen;
            dropdowns[key] = isClickedOpen;
        } else if (event.key === "Escape" || event.key === "Backspace") {
            isClickedOpen = false;
            dropdowns[key] = false;
        }
    }*/

    const handleMenuKeydown = (event: KeyboardEvent, key: keyof typeof dropdowns) => {
        if (event.key === "Escape" || event.key === "Backspace") {
            event.preventDefault();
            isClickedOpen = false;
            dropdowns[key] = false;

            const activeElement = document.activeElement;
            const isInsideDropdown = wrapper.contains(activeElement);
            if (isInsideDropdown) {
                const dropdownButton = wrapper.querySelector(
                    ".dropdown-button",
                ) as HTMLButtonElement;
                dropdownButton?.focus();
            }
        }
    };

    const handleDocumentClick = (event: MouseEvent) => {
        if (!wrapper.contains(event.target as Node)) {
            isClickedOpen = false;
            showDropdown = false;
        }
    };

    onMount(() => {
        document.addEventListener("click", handleDocumentClick);

        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    });
</script>

<div>
    <ul class="tarkeatTiedot">
        <li>
            {#each ajat as rivi}
                <div>{rivi}</div>
            {/each}
        </li>
    </ul>
    <div
        class="hours-dropdown-wrapper"
        bind:this={hoursWrapper}
        onmouseenter={() => handleMouseEnter("hours")}
        onmouseleave={() => handleMouseLeave("hours")}
        onkeydown={(e) => handleMenuKeydown(e, "hours")}
        aria-hidden="true"
    >
        <button
            class="dropdown-button"
            onclick={(e) => handleClick(e, "hours")}
            onkeydown={(e) => handleMenuKeydown(e, "hours")}
            aria-haspopup="true"
            aria-expanded={dropdowns.hours}
        >
            {tänään}: {tänäänAuki}
            <img
                class="dropdownarrow"
                src="/images/dropdown-arrow.svg"
                alt="dropdownarrow"
                style="transform: rotate({dropdowns.hours ? 180 : 0}deg); transition: transform 0.2s ease;"
            />
        </button>

        {#if dropdowns.hours}
            <div class="dropdown-content" transition:slide={{ duration: 300 }}>
                {#each ajat as rivi}
                    <div class="dropdown-one-content">{rivi}</div>
                {/each}
            </div>
        {/if}
    </div>
</div>

<header>
    <div
        class="dropdown-wrapper"
        bind:this={wrapper}
        onmouseenter={() => handleMouseEnter("services")}
        onmouseleave={() => handleMouseLeave("services")}
        onkeydown={(e) => handleMenuKeydown(e, "services")}
        aria-hidden="true"
    >
        <button
            class="dropdown-button"
            onclick={(e) => handleClick(e, "services")}
            onkeydown={(e) => handleMenuKeydown(e, "services")}
            aria-haspopup="true"
            aria-expanded={dropdowns.services}
        >
            Dropdown
            <img
                class="dropdownarrow"
                src="/images/dropdown-arrow.svg"
                alt="dropdownarrow"
                style="transform: rotate({dropdowns.services ? 180 : 0}deg); transition: transform 0.2s ease;"
            />
        </button>

        {#if dropdowns.services}
            <div class="dropdown-content services" transition:slide={{ duration: 700 }}>
                {#each palvelut as palvelu}
                    <a href="/" class="dropdown-one-content">{palvelu.toUpperCase()}</a>
                {/each}
            </div>
        {/if}
    </div>
    <a href="/">
        <img
            class="headerlogo"
            src="/images/viitaelli-logo-teksti.png"
            alt="Viitaellit logo"
        />
    </a>
    {#each napit as nappi}
        <a href="/test">
            {nappi.toUpperCase()}
        </a>
        <br />
    {/each}
</header>

{#if children}
    <div class="page-content">
        {@render children()}
    </div>
{:else}
    <div>Jotain meni pieleen</div>
{/if}

<style>
    header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        position: sticky;
        top: 0;
        z-index: 100;
        background-color: rgb(214, 214, 214);
    }
    .headerlogo {
        width: 250px;
    }
    .page-content {
        height: calc(100vh - var(60px));
    }
    .dropdown-wrapper {
        display: inline-block;
        position: relative;
    }

    .dropdown-button {
        display: flex;
        background-color: transparent;
        padding: 16px;
        align-items: center;
        cursor: pointer;
        border: none;
    }

    .dropdown-content {
        position: absolute;
        top: 100%;
        background-color: rgba(210, 210, 210, 0.893);
        min-width: 160px;
        border-bottom-right-radius: 45px;
        border-bottom-left-radius: 20px;
        z-index: 1000;
        white-space: nowrap;
        padding-top: 1rem;
    }

    .dropdown-one-content {
        color: black;
        padding: 12px 16px;
        text-decoration: none;
        display: block;
    }

    .dropdownarrow {
        margin-left: 8px;
    }

    .hours-dropdown-wrapper {
        display: inline-block;
        position: relative;
        margin-right: 1rem;
    }

    .dropdown-content.services {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        background-color: rgba(210, 210, 210, 0.893);
        min-width: 300px;
        box-sizing: border-box;
        border-bottom-right-radius: 45px;
        border-bottom-left-radius: 20px;
        padding-top: 1rem;
    }

    .dropdown-one-content {
        text-align: left;
        padding: 0 0.55rem 1rem 0.55rem;
        white-space: nowrap;
        font-weight: 500;
    }
</style>
