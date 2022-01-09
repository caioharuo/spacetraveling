import { useState } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';

import styles from './home.module.scss';
import commonStyles from '../styles/common.module.scss';

import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Header from '../components/Header';

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

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  async function handleLoadMorePosts() {
    await fetch(nextPage)
      .then(res => res.json())
      .then(loadedPosts => {
        setPosts([...posts, ...loadedPosts.results]);
        setNextPage(loadedPosts.next_page);
      });
  }

  return (
    <div className={styles.container}>
      <div className={commonStyles.container}>
        <Head>
          <title>Home | spacetraveling</title>
        </Head>
        <Header />
        <main className={styles.posts}>
          {posts.map(post => (
            <Link key={post.uid} href={`./post/${post.uid}`}>
              <a>
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>
                <div>
                  <time>
                    <FiCalendar />
                    {format(new Date(post.first_publication_date), 'PP', {
                      locale: ptBR,
                    })}
                  </time>
                  <span>
                    <FiUser />
                    {post.data.author}
                  </span>
                </div>
              </a>
            </Link>
          ))}

          {nextPage !== null ? (
            <button
              onClick={handleLoadMorePosts}
              className={styles.buttonLoadPosts}
            >
              Carregar mais posts
            </button>
          ) : (
            ''
          )}
        </main>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 3,
    }
  );

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  };

  return {
    props: { postsPagination },
  };
};
