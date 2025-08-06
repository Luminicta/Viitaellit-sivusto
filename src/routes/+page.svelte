<script lang="ts">
    import Dropdowns from "$lib/dropdowns.svelte";
    const palvelut = [
        "Anestesia",
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
        "Tähystystutkimukset",
        "Ultraäänitutkimukset",
        "Viralliset tutkimukset",
    ];
</script>


<div class="fullpage">
    <div class="welcome">
        <h1>Toivotamme lämpimästi tervetulleeksi</h1>

        <h2>sekä sinut että lemmikkisi</h2>
    </div>

    <div class="main-content">
        <div class="description">
             <h3>
            TERVETULOA VIITANIEMEN ELÄINLÄÄKÄRIASEMAN KOTISIVUILLE
        </h3>
        <p>
            Viitaniemen eläinlääkäriasema on Jyväskylässä olevan Viitaniemen kaupunginosassa sijaitseva yksityinen, vuonna 2000 perustettu, kotimainen eläinlääkäriasema. Lemmikkinne tulevat täällä hoidetuksi varman ammattitaidon, kokemuksen ja lämpimän huolenpidon kautta.
        </p>
        <p>
            Tarjoamme eläinlääkintäpalveluita pieneläimille, johon sisältyy kaikki perushoidot ja suuhoidot, joiden lisäksi tarjoamme myös silmätutkimuksia ja -hoitoja.
        </p>
        </div>
        <div class="service-intro">
            <div class="services-texts">
                <h1>Saatavilla olevia palveluita</h1>
                <p>
                    Klinikallamme on tarjolla laaja valikoima palveluita, ja erikoisosaamista silmähoitoihin. Alta voit lukea lyhyen kuvauksen muutamista palveluistamme, tai jatkaa sivulle, joka tarkentaa kuvausta.
                </p>
            </div>
            
        </div>
       <div class="services-buttons">
            {#each palvelut as palvelu}
               <div class="service-button">
                <Dropdowns
                label={[palvelu]}
                items={["text"]}
                renderLinks={false}></Dropdowns>
               </div> 
            
            {/each}
       </div>
    </div>
</div>

<style>
.fullpage {
        display: flex;
        flex-direction: column;
        width: 100vw;
        height: 100vw;
    }
    .welcome {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        min-height: 30%;
        background-color: rgb(205, 255, 205);
        font-size: 130%;
    }
    .main-content{
        display: flex;
        font-size: 85%;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
    .service-intro{
        display: flex;
        align-items: center;
        flex-direction: column;
    }
    .services-texts{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .description{
        display: flex;
        flex-direction: column;
        max-width: 50%;
    }
    .services-buttons{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        flex: 1;
        align-items: center;
        max-width: 80%;
        gap: 3%;
    }
    .service-button{
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 20px 30px;
        margin-bottom: 2%;
        background-color: rgb(205, 255, 205);
        flex: 1;
        min-width: 10%;
        max-width: 15%;
    }
</style>
