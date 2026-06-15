# Il Nome Giusto 🌿

> Trova il nome perfetto per il tuo bambino — questionario guidato dall'AI

## Come funziona

1. I genitori rispondono a 8 domande (suono, origine, valori, cognome…)
2. L'app mostra **3 nomi gratis** con etimologia e descrizione personalizzata
3. Per sbloccare tutti e 5 i nomi, l'utente paga **€4,90** via Stripe
4. Dopo il pagamento viene reindirizzato alla pagina `/successo` con il report completo

---

## Struttura del progetto

```
il-nome-giusto/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  ← Metadata SEO e font
│   │   ├── page.tsx                    ← Pagina principale
│   │   ├── globals.css                 ← Stili globali e variabili CSS
│   │   ├── successo/
│   │   │   ├── page.tsx                ← Pagina post-pagamento
│   │   │   ├── SuccessContent.tsx      ← Genera il report dopo Stripe
│   │   │   └── success.module.css
│   │   └── api/
│   │       ├── genera-nomi/route.ts    ← Chiama Claude (server-side)
│   │       ├── checkout/route.ts       ← Crea sessione Stripe
│   │       └── webhook/route.ts        ← Conferma pagamento da Stripe
│   ├── components/
│   │   ├── NomeApp.tsx                 ← Orchestratore principale
│   │   ├── Header.tsx
│   │   ├── QuizStep.tsx
│   │   ├── LoadingState.tsx
│   │   └── Results.tsx                 ← Card nomi + paywall Stripe
│   └── lib/
│       ├── questions.ts                ← Domande del questionario
│       └── types.ts                    ← TypeScript types
├── .env.local.example                  ← Template variabili d'ambiente
├── vercel.json
└── package.json
```

---

## Setup locale (15 minuti)

### 1. Installa le dipendenze

```bash
npm install
```

### 2. Configura le variabili d'ambiente

```bash
cp .env.local.example .env.local
```

Apri `.env.local` e inserisci:

| Variabile | Dove trovarla |
|---|---|
| `ANTHROPIC_API_KEY` | https://console.anthropic.com/ |
| `STRIPE_SECRET_KEY` | https://dashboard.stripe.com/apikeys (usa la chiave **test** in locale) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stessa pagina, chiave pubblica |
| `STRIPE_WEBHOOK_SECRET` | Vedi sezione webhook sotto |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` in locale |

### 3. Configura il webhook Stripe in locale

```bash
# Installa la CLI di Stripe
brew install stripe/stripe-cli/stripe   # macOS
# oppure scarica da: https://stripe.com/docs/stripe-cli

# Autenticati
stripe login

# Avvia il listener (in un terminale separato)
stripe listen --forward-to localhost:3000/api/webhook
```

Copia il **webhook signing secret** mostrato e incollalo in `.env.local` come `STRIPE_WEBHOOK_SECRET`.

### 4. Avvia il progetto

```bash
npm run dev
```

Apri **http://localhost:3000**

---

## Deploy su Vercel (10 minuti)

### Step 1 — Carica su GitHub

1. Vai su [github.com](https://github.com) → New repository → chiama `il-nome-giusto`
2. Carica tutti i file (il `.gitignore` esclude già `.env.local` automaticamente)

### Step 2 — Collega a Vercel

1. Vai su [vercel.com](https://vercel.com) → Add New Project
2. Importa il repo GitHub appena creato
3. In **Environment Variables**, aggiungi tutte e 5 le variabili (usa le chiavi **live** di Stripe in produzione, non quelle test)
4. Imposta `NEXT_PUBLIC_SITE_URL` = `https://ilnomegiusto.it`
5. Clicca **Deploy**

### Step 3 — Collega il dominio

1. Vercel → Settings → Domains → aggiungi `ilnomegiusto.it` e `www.ilnomegiusto.it`
2. Copia i record DNS che Vercel mostra
3. Vai nel pannello del tuo registrar e aggiorna i record
4. Attendi 5–30 minuti

### Step 4 — Configura il webhook Stripe in produzione

1. Vai su [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. Clicca **Add endpoint**
3. URL: `https://ilnomegiusto.it/api/webhook`
4. Evento da ascoltare: `checkout.session.completed`
5. Copia il **Signing secret** e aggiornalo su Vercel → Settings → Environment Variables

---

## Modello di business

| | Gratis | Report completo |
|---|---|---|
| Nomi suggeriti | 3 | 5 |
| Etimologia | ✓ | ✓ |
| Descrizione personalizzata | ✓ | ✓ |
| Nomi aggiuntivi | — | ✓ |
| Prezzo | €0 | **€4,90** |

**Costo per generazione:** ~€0,004 (Claude Sonnet 4.6)
**Margine per vendita:** ~99%

---

## Prossimi passi facoltativi

- **Email di conferma** — aggiungi [Resend](https://resend.com) per mandare un'email con i nomi dopo il pagamento
- **PDF scaricabile** — usa `@react-pdf/renderer` per generare un documento elegante
- **Upsell** — proponi un pacchetto da €9,90 con 10 nomi + storia del nome + pronuncia audio
