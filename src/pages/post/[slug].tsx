import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

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
import { ExitPreviewModeButton } from '../../components/ExitPreviewModeButton';

interface Post {
  first_publication_date: string | null;
  last_publication_date: string | null;
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
  previousPost: {
    uid: string;
    data: {
      title: string;
    };
  } | null;
  nextPost: {
    uid: string;
    data: {
      title: string;
    };
  } | null;
}

interface PostProps {
  post: Post;
  preview: boolean;
}

export default function Post({ post, preview }: PostProps) {
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

            {post.last_publication_date && (
              <span className={styles.editedAt}>
                * editado em{' '}
                {format(new Date(post.last_publication_date), 'PPPp', {
                  locale: ptBR,
                })}
              </span>
            )}

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

        <div className={styles.divider} />

        <nav className={styles.neighborPosts}>
          {post.previousPost !== null && (
            <div>
              <span>{post.previousPost.data.title}</span>
              <Link
                href={`http://localhost:3000/post/${post.previousPost.uid}`}
              >
                <a>Post anterior</a>
              </Link>
            </div>
          )}

          {post.nextPost !== null && (
            <div>
              <span>{post.nextPost.data.title}</span>
              <Link href={`http://localhost:3000/post/${post.nextPost.uid}`}>
                <a>Próximo post</a>
              </Link>
            </div>
          )}
        </nav>

        <div className={styles.commentsContainer}>
          <UtterancesComments />
        </div>

        {preview && <ExitPreviewModeButton />}
      </div>
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

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
  previewData,
}) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {
    ref: previewData?.ref ?? null,
  });

  const previousResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['post.title'],
      after: response.id,
      orderings: '[document.first_publication_date desc]',
      pageSize: 1,
      ref: previewData?.ref ?? null,
    }
  );

  const nextResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['post.title'],
      after: response.id,
      orderings: '[document.first_publication_date]',
      pageSize: 1,
      ref: previewData?.ref ?? null,
    }
  );

  if (!response) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const post = {
    first_publication_date: response?.first_publication_date || null,
    last_publication_date: response?.last_publication_date || null,
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

    previousPost: previousResponse.results.length
      ? {
          uid: previousResponse.results[0].uid,
          data: { title: previousResponse.results[0].data.title },
        }
      : null,
    nextPost: nextResponse.results.length
      ? {
          uid: nextResponse.results[0].uid,
          data: { title: nextResponse.results[0].data.title },
        }
      : null,
    preview,
  };

  return {
    props: {
      post,
      preview,
    },
    revalidate: 60 * 30, // 30 minutes
  };
};
