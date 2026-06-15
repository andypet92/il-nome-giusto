'use client'

import { useState } from 'react'
import Header from './Header'
import QuizStep from './QuizStep'
import LoadingState from './LoadingState'
import Results from './Results'
import { QUESTIONS, Answers } from '@/lib/questions'
import { NameResult } from '@/lib/types'

type AppState = 'quiz' | 'loading' | 'results'

export default function NomeApp() {
  const [state, setState] = useState<AppState>('quiz')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [results, setResults] = useState<NameResult[]>([])
  const [error, setError] = useState<string | null>(null)

  const q = QUESTIONS[step]
  const total = QUESTIONS.length
  const isLast = step === total - 1

  function canProceed(): boolean {
    const val = answers[q.id]
    if (q.type === 'text') return true
    if (q.type === 'multi') return Array.isArray(val) && val.length > 0
    return !!val
  }

  function handleChoice(opt: string) {
    setAnswers((prev) => ({ ...prev, [q.id]: opt }))
  }

  function handleMulti(opt: string) {
    setAnswers((prev) => {
      const cur = (prev[q.id] as string[]) || []
      if (cur.includes(opt)) {
        return { ...prev, [q.id]: cur.filter((x) => x !== opt) }
      }
      return { ...prev, [q.id]: [...cur, opt] }
    })
  }

  function handleText(val: string) {
    setAnswers((prev) => ({ ...prev, [q.id]: val }))
  }

  function handleNext() {
    if (step < total - 1) setStep((s) => s + 1)
  }

  function handleBack() {
    if (step > 0) setStep((s) => s - 1)
  }

  function handleSkip() {
    setAnswers((prev) => ({ ...prev, [q.id]: '' }))
    if (step < total - 1) setStep((s) => s + 1)
  }

  async function handleGenerate() {
    setState('loading')
    setError(null)

    try {
      const res = await fetch('/api/genera-nomi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Errore sconosciuto')
      }

      setResults(data.names)
      setState('results')
    } catch (err) {
      setError('Qualcosa non ha funzionato. Riprova tra un momento.')
      setState('quiz')
    }
  }

  function handleRestart() {
    setStep(0)
    setAnswers({})
    setResults([])
    setError(null)
    setState('quiz')
  }

  return (
    <>
      <Header />
      {state === 'quiz' && (
        <QuizStep
          question={q}
          answers={answers}
          step={step}
          total={total}
          onChoice={handleChoice}
          onMulti={handleMulti}
          onText={handleText}
          onNext={handleNext}
          onBack={handleBack}
          onSkip={handleSkip}
          onGenerate={handleGenerate}
          canProceed={canProceed()}
          isLast={isLast}
          error={error}
        />
      )}
      {state === 'loading' && <LoadingState />}
      {state === 'results' && (
        <Results names={results} answers={answers} onRestart={handleRestart} />
      )}
    </>
  )
}
