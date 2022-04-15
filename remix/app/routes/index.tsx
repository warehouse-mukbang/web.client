import { useEffect } from 'react';
import { useLoaderData } from 'remix';
import type { LoaderFunction, MetaFunction } from 'remix';

import GithubPRs from '~/components/services/github/PullRequests';
import GithubIssues from '~/components/services/github/Issues';
import useAuthorizer from '~/hooks/useAuthorizer';

export let meta: MetaFunction = () => {
  return {
    title: 'Vitals Dashboard V2',
  };
};

export let loader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url);
  const authorize = url.searchParams.get('authorize');

  if (authorize) {
    const platform = url.searchParams.get('platform');
    const token = url.searchParams.get('token');

    return {
      Environment: {
        BASE_URL: process.env.BASE_URL,
      },
      platform,
      token,
    };
  }

  return {
    Environment: {
      BASE_URL: process.env.BASE_URL,
    },
  };
};

export default function Index() {
  const loader = useLoaderData();

  useEffect(() => {
    if (!window.localStorage.getItem('WidgetBoard::BASE_URL')) {
      window.localStorage.setItem(
        'WidgetBoard::BASE_URL',
        loader.Environment.BASE_URL
      );
    }
  }, []);

  const { platforms } = useAuthorizer(loader);

  return (
    <main className='min-h-screen h-full w-full p-12 bg-gray-100 dark:bg-gray-900'>
      <ul
        role='list'
        className='grid grid-cols-2 xl:grid-cols-4 gap-4 items-center justify-center h-full'
      >
        <GithubPRs authorized={platforms.github} />
        <GithubIssues authorized={platforms.github} />
      </ul>
    </main>
  );
}
