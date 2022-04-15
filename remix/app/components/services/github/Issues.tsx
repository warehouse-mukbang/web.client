import { useEffect, useState } from 'react';

import { Issue, GithubIssues } from '~/services/github-service.d';

import * as Card from '../../Card';

import AuthIcon from '~/assets/touch-id.png';

const Issues: React.FC<{ authorized?: string | null | boolean }> = ({
  authorized,
}) => {
  const [fetching, set_fetching] = useState(false);
  const [error, set_error] = useState<string>();
  const [issue_count, set_issue_count] = useState<number | string>('~');
  const [open_issues, set_open_issues] = useState<Array<Issue>>([]);

  useEffect(() => {
    (async () => {
      if (authorized) {
        set_fetching(true);

        const data: { error: any, body: GithubIssues, success: boolean } = await fetch(
          `/api/services/github/issues?auth_id=${authorized}`
        ).then(res => res.json());

        if (data.error) {
          set_error(data.error);
          set_fetching(true);
          return;
        }

        set_fetching(false);
        set_issue_count(data.body.total_count);
        set_open_issues(data.body.items);
      }
    })();
  }, [authorized]);

  if (error) {
    return (
      <Card.Base size='large'>
        <Card.Header title='Something went wrong:' subtitle={error} />
      </Card.Base>
    );
  }

  // there is a little bit of glitchy behavior here sometimes.
  // it can be prevented by moving the auth token out of localStorage
  // and into a server-side session. that is also a more secure solution.
  if (fetching) {
    return <Card.Base size='large' loading />;
  }

  if (!authorized) {
    return (
      <Card.Base size='large'>
        <Card.Header
          title='Authorize Github'
          subtitle='Click to authorize Github'
        />

        <section className='h-full flex items-center justify-center'>
          <button
            className='button bg-green-400 p-3 rounded-lg hover:bg-green-500 active:bg-green-600 flex items-center justify-center'
            onClick={() => {
              const BASE_URL = window.localStorage.getItem(
                'WidgetBoard::BASE_URL'
              );

              window.parent.location.href = `${BASE_URL}/api/services/github/oauth-init`;
            }}
          >
            <img
              className='h-4 mr-2'
              alt='authenticate with github'
              src={AuthIcon}
            />
            Authorize with Github
          </button>
        </section>
      </Card.Base>
    );
  }

  return (
    <Card.Base size='large'>
      <Card.Header title='Issues assigned to you:' subtitle={issue_count} />

      <ul className='max-h-full overflow-scroll'>
        {open_issues?.map(issue => (
          <IssueItem {...issue} key={issue.url} />
        ))}
      </ul>
    </Card.Base>
  );
};

const IssueItem: React.FC<Issue> = ({
  url,
  title,
  author,
  comments,
  created_at,
}) => {
  const formatDate = () => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
    }).format(new Date(created_at));
  };
  return (
    <li>
      <a
        href={url}
        target='_top'
        className='border-b border-l border-r dark:border-gray-500 py-2 px-4 flex items-center'
      >
        <p className='truncate w-2/5 dark:text-gray-200'>{title}</p>

        <img src={author.image_url} className='h-8 w-8 mx-2 rounded-full' />
        <p className='text-sm text-gray-500 dark:text-gray-200 w-1/5'>
          @{author.name}
        </p>

        <div className='flex flex-grow justify-between ml-4 items-center'>
          <p className='text-sm text-gray-500'>
            Opened:{' '}
            <span className='text-gray-700 dark:text-gray-200'>
              {formatDate()}
            </span>
          </p>
          <p className='text-sm flex dark:text-gray-200'>
            {comments}
            <span>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 ml-1 dark:text-gray-500'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z'
                />
              </svg>
            </span>
          </p>
        </div>
      </a>
    </li>
  );
};

export default Issues;
