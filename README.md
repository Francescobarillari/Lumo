# Lumo

Lumo e una app per creare, scoprire e partecipare a eventi sociali nella tua citta e non solo.

## Cosa puoi fare

- Creare nuovi eventi con data, orario, luogo e descrizione
- Cercare eventi per citta o interesse
- Salvare eventi da tenere d occhio
- Partecipare e chattare con gli altri partecipanti
- Segnalare utenti o eventi inappropriati

## Come iniziare (per utenti)

1. Apri l app dal link che ti ha fornito il team
2. Crea un account e conferma l email se richiesto
3. Completa il profilo con le informazioni essenziali
4. Esplora gli eventi disponibili o creane uno tuo
5. Partecipa e resta aggiornato tramite le notifiche

## Uso rapido

- Per creare un evento, inserisci titolo, citta, data, orario e una descrizione chiara
- Per partecipare, apri la scheda dell evento e conferma la partecipazione
- Per salvare, aggiungi l evento ai preferiti e ritrovalo in seguito
- Per chattare, entra nella chat dell evento dopo la partecipazione

## Database (per avvio locale)

- Database usato: PostgreSQL
- Config di default: `jdbc:postgresql://localhost:5432/lumo_db`, utente `lumo_user`, password `123456`
- Override tramite env: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` (oppure file `.env` letto da Spring)
- Dati di esempio: importa `dump_updated.sql` con `psql -U lumo_user -d lumo_db -f dump_updated.sql`
- Nota: credenziali nel repo solo per far partire l app; in un ambiente reale vanno gestite come segreti

## Buone pratiche

- Fornisci dettagli precisi su luogo e orari
- Rispetta le regole dell evento e gli altri partecipanti
- Se noti comportamenti scorretti, usa la funzione di segnalazione

## Supporto

Per dubbi o problemi, contatta chi ti ha fornito l app o il referente del progetto.
