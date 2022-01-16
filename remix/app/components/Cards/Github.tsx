import { API_Error } from '~/types/api';
import { GithubData, OpenPR } from '~/types/cards/github';

import * as Card from '../Card';

const GithubCard: React.FC<Partial<GithubData & API_Error>> = ({
  children,
  ...props
}) => {
  if (props.error) {
    return (
      <Card.Base size='large'>
        <Card.Header title='Something went wrong:' subtitle={props.message} />
      </Card.Base>
    );
  }

  const data = props as GithubData;

  return (
    <Card.Base size='large'>
      <Card.Header title='PRs assigned to you:' subtitle={data.pr_count} />

      <ul className='max-h-full overflow-scroll'>
        {data.open_prs.map(pr => (
          <PullRequestItem {...pr} key={pr.url} />
        ))}
      </ul>
    </Card.Base>
  );
};

const PullRequestItem: React.FC<OpenPR> = ({
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

export default GithubCard;
