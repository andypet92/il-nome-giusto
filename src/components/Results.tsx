'use client'

import { useState } from 'react'
import { NameResult } from '@/lib/types'
import { Answers } from '@/lib/questions'
import styles from './Results.module.css'

// Quanti nomi sono visibili gratis
const FREE_NAMES = 3

interface Props {
  names: NameResult[]
  answers: Answers
  isPaid?: boolean
  onRestart: () => void
}

export default function Results({ names, answers, isPaid = false, onRestart }: Props) {
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState<string | null>(null)

  const visibleNames = isPaid ? names : names.slice(0, FREE_NAMES)
  const lockedCount = isPaid ? 0 : names.length - FREE_NAMES

  async function handlePurchase() {
    setPaying(true)
    setPayError(null)

    // Salviamo le risposte nel sessionStorage — le recuperiamo nella pagina /successo
    sessionStorage.setItem('nomeguisto_answers', JSON.stringify(answers))

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Errore sconosciuto')
      }
    } catch (err) {
      setPayError('Impossibile avviare il pagamento. Riprova tra un momento.')
      setPaying(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>I nomi più adatti per voi</h2>
        <p className={styles.sub}>Selezionati su misura in base alle vostre preferenze</p>
      </div>

      {/* Nomi visibili (gratis o tutti se paid) */}
      {visibleNames.map((n, i) => (
        <div key={n.name} className={`${styles.nameCard} ${i === 0 ? styles.featured : ''}`}>
          {i === 0 && <div className={styles.badge}>Il più adatto</div>}
          <div className={styles.namePrimary}>{n.name}</div>
          <div className={styles.nameOrigin}>{n.origin}</div>
          <p className={styles.nameDesc}>{n.description}</p>
          {n.tags && n.tags.length > 0 && (
            <div className={styles.tags}>
              {n.tags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Blocco paywall — visibile solo se non è paid e ci sono nomi nascosti */}
      {!isPaid && lockedCount > 0 && (
        <div className={styles.paywall}>
          <div className={styles.paywallLocked}>
            {Array.from({ length: lockedCount }).map((_, i) => (
              <div key={i} className={styles.lockedCard}>
                <div className={styles.lockedName}>••••••</div>
                <div className={styles.lockedBar} />
                <div className={styles.lockedBar} style={{ width: '70%' }} />
              </div>
            ))}
            <div className={styles.paywallOverlay} />
          </div>

          <div className={styles.paywallCta}>
            <p className={styles.paywallTitle}>
              Hai ancora {lockedCount} nomi selezionati per voi
            </p>
            <p className={styles.paywallDesc}>
              Sblocca il report completo con tutti e 5 i nomi, l&apos;etimologia approfondita
              e la compatibilità fonetica con il vostro cognome.
            </p>
            <button
              className={styles.btnPay}
              onClick={handlePurchase}
              disabled={paying}
            >
              {paying ? 'Reindirizzamento…' : '✦ Sblocca tutti i nomi — €4,90'}
            </button>
            {payError && <p className={styles.payError}>{payError}</p>}
            <p className={styles.paywallSub}>
              Pagamento sicuro con carta · Una volta sola · Nessun abbonamento
            </p>
          </div>
        </div>
      )}

      <button className={styles.btnRestart} onClick={onRestart}>
        ↺ Ricomincia con preferenze diverse
      </button>
    </div>
  )
}
