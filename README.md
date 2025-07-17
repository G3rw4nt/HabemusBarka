# HabemusBarka

Prosty bot Discorda odtwarzający "Barkę" na kanałach głosowych serwerów Discorda, na których jest obecny o godzinie 21:37.

## Wymagania

Przed uruchomieniem przygotuj plik `.env` zawierający:

```
DISCORD_TOKEN=<twój token bota>
CLIENT_ID=<id aplikacji>
```

## Budowanie obrazu

W katalogu projektu wykonaj:

```bash
docker build -t habemusbarka .
```

## Deploy komend

Aby wysłać komendy slash do Discorda (operacja jednorazowa), użyj:

```bash
docker run --rm --env-file .env habemusbarka npm run deploy
```

## Uruchomienie bota

`docker run -d --name habemusbarka --env-file .env -v %cd%/autoplay-settings.json:/app/autoplay-settings.json -v %cd%/habemusbarka.log:/app/logs habemusbarka.log habemusbarka
`

Pliki `autoplay-settings.json` oraz `habemusbarka.log` będą przechowywane na hoście.
