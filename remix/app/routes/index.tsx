import type { MetaFunction, LoaderFunction } from 'remix';
import { useLoaderData, json } from 'remix';

import GithubService from '~/services/github-service';
import Github from '~/components/Cards/Github';
import { GithubData } from '~/types/cards/github';

import ShortcutService from '~/services/shortcut-service';
import Shortcut from '~/components/Cards/Shortcut';
import { Story } from '~/types/cards/shortcut';

import RedditService from '~/services/reddit-service';
import Reddit from '~/components/Cards/Reddit';
import { Post } from '~/types/cards/reddit';

import PagerDutyService from '~/services/pagerduty-service';
import PagerDuty from '~/components/Cards/PagerDuty';
import { OnCallSchedule } from '~/types/cards/pagerduty';

export let meta: MetaFunction = () => {
  return {
    title: 'Vitals Dashboard V2',
  };
};

interface PageData {
  github: GithubData;
  shortcut: Story[];
  reddit: Post;
  pagerduty: OnCallSchedule;
}

export let loader: LoaderFunction = async (): Promise<PageData> => {
  const github_service = new GithubService(fetch);
  const shortcut_service = new ShortcutService(fetch);
  const reddit_service = new RedditService(fetch);
  const pagerduty_service = new PagerDutyService(fetch);

  const [github, shortcut, reddit, pagerduty] = await Promise.all([
    github_service.get(),
    shortcut_service.get(),
    reddit_service.get(),
    pagerduty_service.get(),
  ]);

  return {
    github,
    shortcut,
    reddit,
    pagerduty,
  };
};

export default function Index() {
  let data = useLoaderData<PageData>();

  return (
    <main className='min-h-screen h-full w-full p-12 bg-gray-100'>
      <ul
        role='list'
        className='grid grid-cols-2 xl:grid-cols-4 gap-4 items-center justify-center h-full'
      >
        <Github {...data.github} />
        <Shortcut stories={data.shortcut} />
        <Reddit post={data.reddit} />
        <PagerDuty {...data.pagerduty} />
      </ul>
    </main>
  );
}
