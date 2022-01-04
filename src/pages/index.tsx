import { GetStaticProps } from 'next';
import Link from 'next/link';
import Header from '../components/Header';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(props: HomeProps) {
  return (
    <div className={commonStyles.container}>
      <Header />

      <main className={styles.posts}>
        <Link href="#">
          <a>
            <strong>Como utilizar Hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div>
              <time>
                <img src="/images/calendar.svg" alt="ícone de calendário" />
                15 Mar 2021
              </time>
              <span>
                <img src="/images/user.svg" alt="ícone de usuário" />
                Joseph Oliveira
              </span>
            </div>
          </a>
        </Link>
        <Link href="#">
          <a>
            <strong>Criando um app CRA do zero</strong>
            <p>
              Tudo sobre como criar a sua primeira aplicação utilizando Create
              React App
            </p>
            <div>
              <time>
                <img src="/images/calendar.svg" alt="ícone de calendário" />
                19 Abr 2021
              </time>
              <span>
                <img src="/images/user.svg" alt="ícone de usuário" />
                Danilo Vieira
              </span>
            </div>
          </a>
        </Link>
        <Link href="#">
          <a>
            <strong>Como utilizar Hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div>
              <time>
                <img src="/images/calendar.svg" alt="ícone de calendário" />
                15 Mar 2021
              </time>
              <span>
                <img src="/images/user.svg" alt="ícone de usuário" />
                Joseph Oliveira
              </span>
            </div>
          </a>
        </Link>
        <Link href="#">
          <a>
            <strong>Criando um app CRA do zero</strong>
            <p>
              Tudo sobre como criar a sua primeira aplicação utilizando Create
              React App
            </p>
            <div>
              <time>
                <img src="/images/calendar.svg" alt="ícone de calendário" />
                19 Abr 2021
              </time>
              <span>
                <img src="/images/user.svg" alt="ícone de usuário" />
                Danilo Vieira
              </span>
            </div>
          </a>
        </Link>
      </main>
    </div>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
