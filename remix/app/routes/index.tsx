import type { MetaFunction } from 'remix';

import GithubPRs from '~/components/services/github/PullRequests';

export let meta: MetaFunction = () => {
  return {
    title: 'Vitals Dashboard V2',
  };
};

export default function Index() {
  return (
    <main className='min-h-screen h-full w-full p-12 bg-gray-100 dark:bg-gray-900'>
      <ul
        role='list'
        className='grid grid-cols-2 xl:grid-cols-4 gap-4 items-center justify-center h-full'
      >
        <GithubPRs />
      </ul>
    </main>
  );
}
