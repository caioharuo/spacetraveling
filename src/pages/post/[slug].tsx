import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Header from '../../components/Header';

import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';

import { getPrismicClient } from '../../services/prismic';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { useRouter } from 'next/router';
import { UtterancesComments } from '../../components/UtterancesComments';

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

export default function Post({ post }: PostProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  const wordsPerMinute = 200;
  const totalWords = Math.round(
    post.data.content.reduce(
      (acc, contentItem) =>
        acc +
        contentItem.heading.split(' ').length +
        contentItem.body.reduce(
          (acc2, bodyItem) => acc2 + bodyItem.text.split(' ').length,
          0
        ),
      0
    )
  );

  const readingTime = Math.ceil(totalWords / wordsPerMinute);

  return (
    <>
      <Head>
        <title>{post.data.title} | spacetraveling</title>
      </Head>

      <div className={styles.headerContainer}>
        <Header />
      </div>

      <img
        src={post.data.banner.url ? post.data.banner.url : '/images/banner.png'}
        alt="banner"
        className={styles.banner}
      />
      <div className={commonStyles.container}>
        <main className={styles.container}>
          <article className={styles.post}>
            <h1>{post.data.title}</h1>
            <div>
              <time>
                <FiCalendar />
                {format(new Date(post.first_publication_date), 'PP', {
                  locale: ptBR,
                })}
              </time>
              <span>
                <FiClock />
                {post.data.author}
              </span>
              <span>
                <FiUser />
                {readingTime} min
              </span>
            </div>

            {post.data.content.map((content, index) => (
              <section
                className={styles.postContent}
                key={`${post.data.title}-${index}`}
              >
                <h2 className={styles.headingSection}>{content.heading}</h2>
                <div
                  className={styles.bodySection}
                  dangerouslySetInnerHTML={{
                    __html: String(RichText.asHtml(content.body)),
                  }}
                />
              </section>
            ))}
          </article>
        </main>
      </div>

      <UtterancesComments />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.banner', 'posts.author', 'posts.content'],
      pageSize: 3,
    }
  );

  const paths = posts.results.map(post => ({
    params: {
      slug: post.uid,
    },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
    first_publication_date: response.first_publication_date,
    uid: response.uid,

    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url || null,
      },
      author: response.data.author,
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: content.body,
        };
      }),
    },
  };

  return {
    props: {
      post,
    },
  };
};
