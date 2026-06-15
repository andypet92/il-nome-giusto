import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logoMark} aria-hidden="true">✦</div>
      <h1 className={styles.brand}>
        Il Nome <span className={styles.accent}>Giusto</span>
      </h1>
      <p className={styles.subtitle}>Trova il nome perfetto per il tuo bambino</p>
    </header>
  )
}
