<script lang="ts">
    import Dropdowns from "$lib/dropdowns.svelte";
    import { ajat, getTodayOpeningTime } from "$lib/hours-utils";

    const tänään = "Tänään";
    const tänäänAuki = getTodayOpeningTime();
    let { children } = $props();

    const napit = [
        "etusivu",
        "palvelut",
        "hinnasto",
        "henkilökunta",
        "yhteystiedot",
        "artikkelit",
        "ajanvaraus"
    ];

    const palvelut = [
        "Yleistä tietoa",
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
</script>

<header class="header">
    <div class="header__container">
        <div class="header__container__left">
            <a class="logolink" href="/">
                <img
                    class="headerlogo"
                    src="/images/viitaelli-logo-teksti.png"
                    alt="Viitaellit logo"
                />
            </a>
        </div>
        <div class="header__container__right">
            <nav class="nav">
                {#each napit as nappi}
                    {#if nappi == "etusivu"}
                    <div class="headeritem">
                        <a href={`/`} class="nav-link">{nappi}</a>
                    </div>
                        
                    <!--{:else if nappi == "palvelut"}
                    <div class="headeritem">
                        <Dropdowns
                            label={["Palvelut"]}
                            items={palvelut}
                            renderLinks={true}
                        />
                    </div>-->
                        
                    {:else}
                    <div class="headeritem">
                        <a href={`/${nappi}`} class="nav-link">{nappi}</a>
                    </div>
                        
                    {/if}
                {/each}
                <div class="headeritem">
                    <Dropdowns
                    label={[`${tänään}: ${tänäänAuki}`]}
                    items={[...ajat]}
                    renderLinks={false}
                />
                </div>
                
            </nav>
        </div>
    </div>
</header>

{#if children}
    <div class="page-content">
        {@render children()}
    </div>
{:else}
    <div>Jotain meni pieleen</div>
{/if}

<footer>
  
</footer>

<style>
    .header {
        display: flex;
        flex-direction: row;
        background: #f2f2f2;
        padding: 1rem;
        position: sticky;
        top: 0;
        z-index: 100;
        border-bottom: 1px solid #ddd;
        width: 100%;
        font-size: 35px;
        flex-wrap: wrap;
    }
    .nav {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        flex-wrap: wrap;
        flex: 1;
    }
    .nav-link {
        text-transform: capitalize;
        text-decoration: none;
        padding: 0.5rem;
        color: #333;
    }
    .nav-link:hover {
        text-decoration: underline;
    }
    .headerlogo {
        display: block;
        height: auto;
        max-width: 100%;
    }
    .header__container{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        width: inherit;
    }
    .header__container__left{
        display: flex;
        align-items: center;
    }
    .header__container__right{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        
    }
    .headeritem{
        font-size: 58%;
    }
    .page-content{
        display: flex;
        font-size: 150%;
    }
</style>
