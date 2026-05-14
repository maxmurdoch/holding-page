import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <p className={styles.label}>
        <span className={styles.name}>Max Murdoch</span>
        <br />
        <span className={styles.role}>
          Founding Designer at{" "}
          <a
            className={styles.link}
            href="https://jackandjill.ai"
            target="_blank"
            rel="noopener noreferrer"
          >
            Jack &amp; Jill <span className={styles.arrow}>↗</span>
          </a>
        </span>
      </p>
    </main>
  );
}
