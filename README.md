# Netle.se / Riksbyggen Snökarta
<img src="https://riksbyggen.netle.se/img/riksbygget-netle.png" width="51%">

</br>

# Webbapplikation för visualisering av anläggningsdetaljer
> Jag har utvecklat en specialanpassad webbaserad lösning för att optimera hanteringen av viktiga anläggningsdata för Riksbyggen Mariestad. Applikationen tillhandahåller en intuitiv och användarvänlig plattform som visualiserar rutter, föreningar och nyckelplatser såsom sopkärl, trappor och andra viktiga anläggningspunkter.<br><br>
> Systemet gör det enkelt att få en översikt över den fysiska miljön och underlättar planering, effektivitet och logistikhantering. Genom tydliga kartor och interaktiva funktioner ger applikationen Riksbyggens anställda de verktyg de behöver för att enkelt navigera och fatta välgrundade beslut.
> </br></br>

# GPS & Databaser
> Applikationen använder klientens platsbaserade API-tjänst för att i realtid visa både användarens egen position och kollegors positioner på kartan. Positionerna sparas tillsammans med användarens ID och tidsstämpel, men endast den senaste registreringen bibehålls, vilket innebär att systemet inte spårar historiska data. Detta säkerställer att integritet och säkerhet upprätthålls för användarna.
> <br><br>
> Visuella representationer ger en klar och tydlig bild av hur databasinformationen hanteras och presenteras för användarna. Alla nyckelplatser och rutter lagras lokalt hos klienten i ett strukturerat JSON-format, vilket säkerställer en effektiv och tillförlitlig datahantering.

<br>
Databasen (med censurerade användarnamn)
<br>
<img src="https://riksbyggen.netle.se/img/supabase-i.png" width="61%">
<br>

<br>
<img src="https://riksbyggen.netle.se/img/code-i.png" width="61%">
