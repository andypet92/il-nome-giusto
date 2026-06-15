export type QuestionType = 'choice' | 'multi' | 'text'

export interface Question {
  id: string
  label: string
  type: QuestionType
  options?: string[]
  placeholder?: string
}

export const QUESTIONS: Question[] = [
  {
    id: 'genere',
    label: 'Il bambino è…',
    type: 'choice',
    options: ['Maschio', 'Femmina', 'Non lo so ancora'],
  },
  {
    id: 'suono',
    label: 'Che suono ti piace di più?',
    type: 'choice',
    options: [
      'Dolce e morbido — es. Giulia, Luca',
      'Forte e deciso — es. Marco, Chiara',
      'Musicale e ritmico — es. Beatrice, Leonardo',
      'Non ho preferenze',
    ],
  },
  {
    id: 'lunghezza',
    label: 'Preferisci un nome…',
    type: 'choice',
    options: [
      'Corto, 1–2 sillabe',
      'Medio, 3 sillabe',
      'Lungo e articolato',
      'Non ho preferenze',
    ],
  },
  {
    id: 'origine',
    label: 'Hai una preferenza sulle origini?',
    type: 'choice',
    options: [
      'Italiano classico',
      'Latino o greco antico',
      'Internazionale — funziona in più lingue',
      'Straniero o esotico',
      'Nessuna preferenza',
    ],
  },
  {
    id: 'valori',
    label: 'Cosa vuoi che il nome trasmetta?',
    type: 'multi',
    options: [
      'Forza e determinazione',
      'Dolcezza e sensibilità',
      'Saggezza e intelligenza',
      'Creatività e unicità',
      'Semplicità e concretezza',
      'Eleganza e raffinatezza',
    ],
  },
  {
    id: 'cognome',
    label: 'Qual è il vostro cognome?',
    type: 'text',
    placeholder: 'es. Rossi, Ferrari… serve per la compatibilità fonetica',
  },
  {
    id: 'evitare',
    label: 'Ci sono nomi assolutamente da escludere?',
    type: 'text',
    placeholder: 'es. Marco, Giulia… (facoltativo)',
  },
  {
    id: 'ispirazione',
    label: 'C\'è un nome che vi ha sempre affascinato, anche se non siete sicuri?',
    type: 'text',
    placeholder: 'Lascia vuoto se non hai idee…',
  },
]

export type Answers = Record<string, string | string[]>
