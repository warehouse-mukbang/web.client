import { Bug } from '~/types/cards/bugsnag';

import * as Card from '../Card';

const BugSnagCard: React.FC<{ bugs: Bug[]; error?: boolean }> = ({
  bugs,
  error,
}) => {
  return (
    <Card.Base size='large'>
      <Card.Header
        title={'Bugs Introduced Today' + (error ? ':' : '')}
        subtitle={
          error
            ? 'Unable to fetch. Exceeded API rate limit. Try refeshing in 15s'
            : undefined
        }
      />

      <ul className='flex-1 overflow-hidden flex flex-col items-center list-none'>
        {bugs.map(bug => (
          <BugReport {...bug} key={bug.id} />
        ))}
      </ul>
    </Card.Base>
  );
};

const BugReport: React.FC<Bug> = ({
  url,
  error_class,
  severity,
  path,
  message,
  events,
}) => {
  return (
    <li className='w-full'>
      <a
        href={url}
        target='_top'
        className='border-b border-l border-r dark:border-gray-500 py-2 px-4 flex items-center justify-between flex-row'
      >
        <div className='w-4/5'>
          <p className='text-sm text-gray-700 dark:text-gray-200 w-full'>
            <span
              className={`rounded-full h-3 w-3 inline-block mr-2 mb-[-1px] ${
                severity === 'error'
                  ? 'bg-red-500'
                  : severity === 'info'
                  ? 'bg-blue-300'
                  : 'bg-green-300'
              }`}
            ></span>
            {error_class} · {path}
          </p>
          <p className='text-xs text-gray-500 dark:text-gray-300 mr-4 truncate'>
            {message}
          </p>
        </div>

        <div className='flex flex-row items-center justify-center'>
          <p className='text-lg text-gray-700 dark:text-gray-300'>
            {events ?? 0}
          </p>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5 ml-1 text-gray-500'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9'
            />
          </svg>
        </div>
      </a>
    </li>
  );
};

export default BugSnagCard;
