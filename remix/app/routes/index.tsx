import { useLoaderData } from 'remix';
import type { LoaderFunction, MetaFunction } from 'remix';

import GithubPRs from '~/components/services/github/PullRequests';
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
      platform,
      token,
    };
  }

  return true;
};

export default function Index() {
  const loader = useLoaderData();

  const { platforms } = useAuthorizer(loader);

  return (
    <main className='min-h-screen h-full w-full p-12 bg-gray-100 dark:bg-gray-900'>
      <ul
        role='list'
        className='grid grid-cols-2 xl:grid-cols-4 gap-4 items-center justify-center h-full'
      >
        <GithubPRs authorized={platforms.github} />
      </ul>
    </main>
  );
}
