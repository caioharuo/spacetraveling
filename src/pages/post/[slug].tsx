import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post() {
  return (
    <>
      <Head>
        <title>Criando um app CRA do zero | spacetraveling</title>
      </Head>

      <div className={commonStyles.container}>
        <Header />
      </div>
      <img src="/images/banner.png" alt="banner" className={styles.banner} />
      <div className={commonStyles.container}>
        <main className={styles.container}>
          <article className={styles.post}>
            <h1>Criando um app CRA do zero</h1>
            <div>
              <time>
                <img src="/images/calendar.svg" alt="ícone de calendário" />
                15 Mar 2021
              </time>
              <span>
                <img src="/images/user.svg" alt="ícone de usuário" />
                Joseph Oliveira
              </span>
              <span>
                <img src="/images/clock.svg" alt="ícone de relógio" />4 min
              </span>
            </div>
            <div className={styles.postContent}>
              Proin et varius Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. Nullam dolor sapien, vulputate eu diam at, condimentum
              hendrerit tellus. Nam facilisis sodales felis, pharetra pharetra
              lectus auctor sed. Ut venenatis mauris vel libero pretium, et
              pretium ligula faucibus. Morbi nibh felis, elementum a posuere et,
              vulputate et erat. Nam venenatis. Cras laoreet mi Nulla auctor sit
              amet quam vitae commodo. Sed risus justo, vulputate quis neque
              eget, dictum sodales sem. In eget felis finibus, mattis magna a,
              efficitur ex. Curabitur vitae justo consequat sapien gravida
              auctor a non risus. Sed malesuada mauris nec orci congue, interdum
              efficitur urna dignissim. Vivamus cursus elit sem, vel facilisis
              nulla pretium consectetur. Nunc congue. Class aptent taciti
              sociosqu ad litora torquent per conubia nostra, per inceptos
              himenaeos. Aliquam consectetur massa nec metus condimentum, sed
              tincidunt enim tincidunt. Vestibulum fringilla risus sit amet
              massa suscipit eleifend. Duis eget metus cursus, suscipit ante ac,
              iaculis est. Donec accumsan enim sit amet lorem placerat, eu
              dapibus ex porta. Etiam a est in leo pulvinar auctor. Praesent sed
              vestibulum elit, consectetur egestas libero.
            </div>
          </article>
        </main>
      </div>
    </>
  );
}

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient();
//   const posts = await prismic.query(TODO);

//   // TODO
// };

// export const getStaticProps = async context => {
//   const prismic = getPrismicClient();
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };
