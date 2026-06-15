import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { answers } = body

    if (!answers) {
      return NextResponse.json({ error: 'Risposte mancanti' }, { status: 400 })
    }

    const QUESTIONS_LABELS: Record<string, string> = {
      genere: 'Il bambino è',
      suono: 'Suono preferito',
      lunghezza: 'Lunghezza del nome',
      origine: 'Origine preferita',
      valori: 'Valori che il nome deve trasmettere',
      cognome: 'Cognome di famiglia',
      evitare: 'Nomi da evitare',
      ispirazione: 'Nome che ha affascinato i genitori',
    }

    const summary = Object.entries(answers)
      .map(([key, val]) => {
        if (!val || val === '') return null
        const label = QUESTIONS_LABELS[key] || key
        const valStr = Array.isArray(val) ? (val as string[]).join(', ') : val
        return `- ${label}: ${valStr}`
      })
      .filter(Boolean)
      .join('\n')

    const genere = answers.genere || 'non specificato'
    const cognome = answers.cognome || ''

    const prompt = `Sei un esperto di onomastica italiana e internazionale con profonda conoscenza di etimologia, fonetica e psicologia dei nomi.

Una coppia di genitori italiani ti chiede aiuto per scegliere il nome per il loro bambino. Ecco le loro preferenze:

${summary}

Suggerisci esattamente 5 nomi${genere !== 'Non lo so ancora' ? ` per un/una ${genere.toLowerCase()}` : ''}${cognome ? ` con cognome "${cognome}"` : ''}.

Rispondi SOLO con un JSON valido, senza testo prima o dopo, in questo formato esatto:
{
  "names": [
    {
      "name": "Nome",
      "origin": "Origine breve (es. Latino, Greco antico, Ebraico...)",
      "description": "2-3 frasi calde e personali che spiegano perché questo nome si adatta perfettamente alle preferenze della coppia. Parla del significato, del suono, della compatibilità con il cognome se fornito, e di come rispecchia i valori scelti.",
      "tags": ["tag1", "tag2", "tag3"]
    }
  ]
}

I tag devono essere 2-4 aggettivi brevi che descrivono il carattere del nome (es. "Elegante", "Forte", "Moderno", "Internazionale", "Classico", "Raro").
Il primo nome deve essere il più centrato sulle preferenze. Sii caldo, coinvolto, come un amico esperto che tiene davvero al risultato.`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content
      .map((b) => (b.type === 'text' ? b.text : ''))
      .join('')

    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    return NextResponse.json({ names: parsed.names })
  } catch (error) {
    console.error('Errore API:', error)
    return NextResponse.json(
      { error: 'Errore nella generazione dei nomi. Riprova tra un momento.' },
      { status: 500 }
    )
  }
}
