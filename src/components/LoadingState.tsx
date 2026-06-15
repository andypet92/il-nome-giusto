import styles from './LoadingState.module.css'

const MESSAGES = [
  'Analizzo il suono e il ritmo…',
  'Cerco l\'origine perfetta…',
  'Verifico la compatibilità con il cognome…',
  'Sto selezionando i nomi più adatti…',
]

export default function LoadingState() {
  return (
    <div className={styles.container}>
      <div className={styles.circle} aria-hidden="true" />
      <p className={styles.title}>Sto cercando il nome perfetto…</p>
      <p className={styles.sub}>Analizzo suono, significato e compatibilità</p>
    </div>
  )
}
