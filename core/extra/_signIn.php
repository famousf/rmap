<div class="auth-screen" id="ldle3a">
  <video autoplay muted loop playsinline class="video-background">
      <source src="img/media/vidbg.webm" type="video/webm">
          Your browser does not support the video tag.
  </video>
  <div class="auth-pick-user">
    <h1>... Logga in</h1>
    <div class="auth-form">
      <span>Email</span>
      <input type="text" name="username" id="email">

      <span>Lösenord</span>
      <input type="password" name="password" id="password">
      <!--
      <span>Organisation</span>
      <input type="text" name="orgNumber" id="orgNumber">
-->

      <button type="submit" name="loginButton" onclick="signInUser(this)">Logga in</button>
    </div>
    <img id="rb_white" src="img/logo.svg" alt="">
  </div>

  <div class="tos">
    <h2>Användarvillkor</h1>
    <div class="scrollable-tos">
      <h1>1. Allmänt</h1>
      <span>1.1. Netle.se ägs och drivs av Ludwig Clas Stefan Eriksson</span>
      <span>1.2. Tjänsten är tillgänglig för alla användare i Sverige med access utan krav på åldersgräns eller betalning.</span>
      <span>1.3. Genom att logga in och använda Tjänsten samtycker du till dessa Villkor och förbinder dig att följa dem.</span>
      <h1>2. Användaruppgifter och datasäkerhet</h1>
      <span>2.1. Vid registrering och användning av Tjänsten samlar vi in och behandlar personuppgifter enligt EU:s allmänna dataskyddsförordning (GDPR). Alla uppgifter, inklusive lösenord, krypteras enligt branschstandarder för att säkerställa högsta möjliga säkerhet och skydda din integritet.</span>
      <h1>3. Datagenerering och ägande</h1>
      <span>3.1. All data som genereras genom användning av Tjänsten, inklusive men inte begränsat till GPS-positioner, körjournaler, och kartdetaljer ("Genererad Data"), ägs exklusivt av Netle.se.</span>
      <span>3.2. Som användare förstår och accepterar du att Netle.se har full rätt att lagra, analysera, och använda Genererad Data för kommersiella, tekniska eller andra ändamål, i enlighet med gällande lagstiftning.</span>
      <span>3.3. Netle.se förbinder sig att inte dela personligt identifierbar information med tredje part utan ditt uttryckliga samtycke, förutom då det krävs enligt lag.</span>
      <h1>4. Ansvarsbegränsning</h1>
      <span>4.1. Tjänsten tillhandahålls i befintligt skick utan garantier av något slag. Netle.se ansvarar inte för eventuell förlust av data, driftstörningar eller annan skada som kan uppstå vid användning av Tjänsten.</span>
      <span>4.2. Användaren är ansvarig för att använda Tjänsten i enlighet med gällande lagstiftning och för att säkerställa korrekt användning av Genererad Data.</span>
      <h1>5. Tvistlösning och gällande lag</h1>
      <span>5.1. Dessa Villkor regleras av Svensk lag.</span>
      <span>5.2. Eventuella tvister som uppstår i samband med Tjänsten ska i första hand lösas genom förhandling mellan parterna. Om en lösning inte kan nås ska tvisten avgöras av allmän domstol i Sverige med Stockholms tingsrätt som första instans.</span>
      <h1>6. Äganderätt och oberoende drift</h1>
      <span>6.1. Netle.se ägs och drivs av Ludwig Clas Stefan Eriksson som privatperson. All utveckling, administration och hantering av appen sker oberoende av den arbetsplats där tjänsten används eller av Ludwig Clas Stefan Erikssons anställning.</span>
      <span>6.2. Eventuell användning av Netle.se på arbetsplatsen där Ludwig Clas Stefan Eriksson är anställd innebär inte att arbetsgivaren kan göra anspråk på appens äganderätt, immateriella rättigheter, eller annan funktionalitet. Appen drivs och förvaltas helt utanför ramen för anställningen.</span>
      <span>6.3. Netle.se tillhandahålls som en oberoende tjänst och har ingen formell koppling till Ludwig Clas Stefan Erikssons arbetsgivare. Arbetsgivaren har ingen rätt till insyn, ägande eller del av appens kod, databaser, eller andra relaterade tillgångar.</span>
      <h1>7. Ändringar av Villkor</h1>
      <span>7.1. Netle.se förbehåller sig rätten att närsomhelst uppdatera eller ändra dessa Villkor. Eventuella ändringar publiceras på Netle.se och träder i kraft omedelbart.</span>
      <span>7.2. Genom att fortsätta använda Tjänsten efter att ändringar har trätt i kraft samtycker du till de uppdaterade Villkoren.</span>
      <h1>8. Data som sparas</h1>
      <span>8.1 Konto- och användaruppgifter</span>
      <span>För att skapa och administrera ett användarkonto sparas användarens namn och jobbmejladress. Lösenord hanteras av Supabase Auth och lagras inte i klartext. Lösenorden skyddas genom säker hashning, vilket innebär att det ursprungliga lösenordet inte kan läsas ut från systemet.</span>
      <span>8.2 Senast registrerade position</span>
      <span>När appen är aktiv och används i förgrunden registreras användarens geografiska position. En ny position registreras var femte sekund så länge appen är aktiv. Ingen positionsregistrering sker när appen körs i bakgrunden.</span>
      <span>Systemet sparar endast användarens senast registrerade position. Tidigare positioner skrivs över när en ny position registreras och sparas inte som historik. Det innebär att systemet inte lagrar någon positionshistorik och därför inte kan användas för att i efterhand återskapa eller följa användarens tidigare rutt.</span>
      <span>8.3 Kördata</span>
      <span>Vid användning av appen sparas uppgifter om utförda arbetsuppgifter. Kördata kan bland annat innehålla användarens namn, tidpunkt för utförd uppgift, vilken uppgift som har utförts samt vilken förening uppgiften är kopplad till.</span>
      <span>Uppgifterna lagras strukturerat i systemets databastabeller och används för att registrera, följa upp och administrera utfört arbete.</span>  <br><br>
      <span><strong>8.4 Transparens</strong></span>
<span>Projektet är öppet och transparent. Hela projektets källkod och tekniska implementation finns tillgänglig för granskning på GitHub. Detta gör det möjligt att själv undersöka hur appen fungerar, vilken data som hanteras och hur systemets olika delar är implementerade.</span>
<span>Projektets källkod finns tillgänglig på <a href="https://github.com/famousf/rmap" target="_blank" rel="noopener noreferrer">https://github.com/famousf/rmap</a>.</span>
      <h1>9. Kontakt</h1>
      <span>Om du har frågor om dessa Villkor eller Tjänsten, vänligen kontakta oss på admin@netle.se.</span>
      <div class="tos_holder">
        <button type="button" id="tos_button">Jag accepterar villkoren!</button>
      </div>
    </div>
  </div>
</div>
