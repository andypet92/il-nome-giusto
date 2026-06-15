'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { NameResult } from '@/lib/types'
import Results from '@/components/Results'
import LoadingState from '@/components/LoadingState'
import Header from '@/components/Header'
import styles from './success.module.css'

export default function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState<'loading' | 'generating' | 'done' | 'error'>('loading')
  const [names, setNames] = useState<NameResult[]>([])

  useEffect(() => {
    if (!sessionId) {
      setStatus('error')
      return
    }

    // Recupera le risposte salvate nel sessionStorage prima del pagamento
    const savedAnswers = sessionStorage.getItem('nomeguisto_answers')

    if (!savedAnswers) {
      // Se non ci sono risposte salvate (es. utente ha riaperto la pagina dopo),
      // mostriamo un messaggio generico di ringraziamento
      setStatus('done')
      return
    }

    setStatus('generating')
    const answers = JSON.parse(savedAnswers)

    fetch('/api/genera-nomi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.names) {
          setNames(data.names)
          sessionStorage.removeItem('nomeguisto_answers')
        }
        setStatus('done')
      })
      .catch(() => setStatus('error'))
  }, [sessionId])

  if (status === 'loading' || status === 'generating') {
    return (
      <>
        <Header />
        <LoadingState />
      </>
    )
  }

  if (status === 'error') {
    return (
      <>
        <Header />
        <div className={styles.container}>
          <p className={styles.errorText}>
            Qualcosa non ha funzionato. Scrivi a{' '}
            <a href="mailto:ciao@ilnomegiusto.it">ciao@ilnomegiusto.it</a>{' '}
            e ti rimandiamo il report subito.
          </p>
        </div>
      </>
    )
  }

  if (names.length > 0) {
    return (
      <>
        <Header />
        <Results names={names} onRestart={() => (window.location.href = '/')} />
      </>
    )
  }

  // Fallback: pagamento ricevuto ma sessione già consumata
  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.checkmark} aria-hidden="true">✦</div>
        <h2 className={styles.title}>Pagamento ricevuto</h2>
        <p className={styles.sub}>
          Grazie! Il tuo report è stato elaborato. Se hai bisogno di assistenza,
          scrivi a <a href="mailto:ciao@ilnomegiusto.it">ciao@ilnomegiusto.it</a>.
        </p>
        <a href="/" className={styles.btnHome}>Torna alla home</a>
      </div>
    </>
  )
}
