# Mediajakosovellus

## Tuntiesimerkkien pohalta tehty sovellus johon lisätty ja korjattu ominaisuuksia.

### Lisätty ominaisuuksia:

- Korjattu poistonapin aiheuttama uudelleenrenderöintiongelma. Johtui siitä, että nappi medialistassa piti tarkistaa jokaisen itemin kohdalla aiheuttaen uudelleenrenderöinnin. Nyt nappi on siirretty itemin modaliin, jolloin se ei aiheuta uudelleenrenderöintiä.
- Ulkoasua hieman hiottu, mutta koin sen turhana ajankäyttönä ja jätin sen vähemmälle
- Itemeille on luotu modaali johon on myös tehty muokkaustoiminto, jossa kentät vain muuttuvat muokattaviksi ja tallennusnappi tulee näkyviin
- Like nappi modaalissa toimii välittömästi ja päivittyy jo ennen vastausta palvelimelta
- Itemeiden poistaminen onnistuu modaalin kautta ja lista päivittyy kun itemi on poistettu
- Profiilisivulle on lisätty käyttäjän omat itemit, joita voi muokata ja poistaa
- Profiilisivulle on lisätty profiilikuva ominaisuus joka toimii palvelimen tagien kautta. Myös uuden profiilikuvan voi ladata palvelimelle, jolloin vanha tagi poistuu ja profiilikuva päivittyy.
- Home sivun itemit ladataan nyt vain 16 kerrallaan, jotta vältytään liialliselta datan lataamiselta kerralla ja sivun lataaminen on nopeampaa.
- Home sivun alareunassa on seuraava sivu nappi, joka lataa seuraavat 16 itemiä uudelle sivulle. Nappi on piilotettu jos itemejä ei ole enempää.
- Backendistä on poistettu admin vaatimus tagin poistamisesta, jotta käyttäjä voi poistaa omat taginsa ja vaihtaa profiilikuvan.
- Backend on muutettu palauttamaan itemit aikajärjestyksessä, jotta uusimmat itemit ovat ensimmäisenä listassa.

### Lisätty ominaisuuksia projektin esittelyn jälkeen:

- Backendiin lisätty Google tuki Google kirjautumiseen. Kun käyttäjä kirjautuu ensimmäistä kertaa Googlella, luodaan käyttäjänimi sähköpostiosoitteesta tarkistaen, että käyttäjänimi ei ole varattu. Jos on, lisätään perään numeroita kunnes käyttäjänimi on uniikki.
- Frontendiin lisätty Google kirjautumisnappi, joka kirjaa käyttäjän sisään ja tallentaa tokenin.
