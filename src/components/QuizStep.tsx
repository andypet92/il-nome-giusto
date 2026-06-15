'use client'

import { Question, Answers } from '@/lib/questions'
import styles from './QuizStep.module.css'

interface Props {
  question: Question
  answers: Answers
  step: number
  total: number
  onChoice: (val: string) => void
  onMulti: (val: string) => void
  onText: (val: string) => void
  onNext: () => void
  onBack: () => void
  onSkip: () => void
  onGenerate: () => void
  canProceed: boolean
  isLast: boolean
  error: string | null
}

export default function QuizStep({
  question,
  answers,
  step,
  total,
  onChoice,
  onMulti,
  onText,
  onNext,
  onBack,
  onSkip,
  onGenerate,
  canProceed,
  isLast,
  error,
}: Props) {
  const progress = (step / total) * 100
  const selected = answers[question.id]

  return (
    <div className={styles.container}>
      <div className={styles.stepCounter}>
        {step + 1} di {total}
      </div>

      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>

      <p className={styles.questionLabel}>{question.label}</p>

      {question.type === 'choice' && (
        <div className={styles.choices}>
          {question.options!.map((opt) => (
            <button
              key={opt}
              className={`${styles.choiceBtn} ${selected === opt ? styles.selected : ''}`}
              onClick={() => onChoice(opt)}
            >
              {opt}
              {selected === opt && <span className={styles.checkIcon} aria-hidden="true">✓</span>}
            </button>
          ))}
        </div>
      )}

      {question.type === 'multi' && (
        <>
          <p className={styles.multiHint}>Puoi selezionare più opzioni</p>
          <div className={styles.choices}>
            {question.options!.map((opt) => {
              const isSelected = Array.isArray(selected) && selected.includes(opt)
              return (
                <button
                  key={opt}
                  className={`${styles.choiceBtn} ${isSelected ? styles.selected : ''}`}
                  onClick={() => onMulti(opt)}
                >
                  {opt}
                  {isSelected && <span className={styles.checkIcon} aria-hidden="true">✓</span>}
                </button>
              )
            })}
          </div>
        </>
      )}

      {question.type === 'text' && (
        <input
          className={styles.textInput}
          type="text"
          placeholder={question.placeholder}
          value={(selected as string) || ''}
          onChange={(e) => onText(e.target.value)}
          autoComplete="off"
        />
      )}

      <div className={styles.navRow}>
        {step > 0 ? (
          <button className={styles.btnBack} onClick={onBack}>
            ← Indietro
          </button>
        ) : (
          <span />
        )}

        {!isLast ? (
          <div className={styles.nextGroup}>
            {question.type === 'text' && (
              <button className={styles.skipLink} onClick={onSkip}>
                Salta
              </button>
            )}
            <button className={styles.btnNext} onClick={onNext} disabled={!canProceed}>
              Avanti
            </button>
          </div>
        ) : (
          <div className={styles.generateGroup}>
            {question.type === 'text' && (
              <button className={styles.skipLink} onClick={onSkip}>
                Salta
              </button>
            )}
            <button
              className={styles.btnGenerate}
              onClick={onGenerate}
              disabled={!canProceed}
            >
              ✦ Trova il nome giusto
            </button>
          </div>
        )}
      </div>

      {error && <div className={styles.errorBox}>{error}</div>}
    </div>
  )
}
