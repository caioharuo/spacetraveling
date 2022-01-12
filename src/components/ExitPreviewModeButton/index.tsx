import Link from 'next/link';

import styles from './styles.module.scss';

export function ExitPreviewModeButton() {
  return (
    <Link href="/api/exit-preview">
      <a className={styles.link}>Sair do modo Preview</a>
    </Link>
  );
}
