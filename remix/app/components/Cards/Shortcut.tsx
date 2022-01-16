import { API_Error } from '~/types/api';
import { Story } from '~/types/cards/shortcut';

import * as Card from '../Card';

const ShortcutCard: React.FC<
  Partial<
    {
      stories: Story[];
    } & API_Error
  >
> = ({ children, ...props }) => {
  if (props.error) {
    return (
      <Card.Base size='large'>
        <Card.Header title='Something went wrong:' subtitle={props.message} />
      </Card.Base>
    );
  }

  const { stories } = props as { stories: Story[] };

  return (
    <Card.Base size='large'>
      <Card.Header title='Your Shortcut Stories:' subtitle={stories.length} />

      <ul className='max-h-full overflow-scroll'>
        {stories.map(story => (
          <StoryItem {...story} key={story.url} />
        ))}
      </ul>
    </Card.Base>
  );
};

const StoryItem: React.FC<Story> = ({
  url,
  title,
  type,
  estimate,
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
        <p className='text-sm text-gray-500 dark:text-gray-300 mr-4 w-[45px]'>
          {type}
        </p>

        <p className='truncate w-3/5 dark:text-gray-100'>{title}</p>

        <div className='flex flex-grow justify-between ml-4 items-center'>
          <p className='text-sm text-gray-500 dark:text-gray-500'>
            Opened:{' '}
            <span className='text-gray-700 dark:text-gray-300'>
              {formatDate()}
            </span>
          </p>
          <div className='text-sm flex'>
            <p className='m-0 mr-1 p-0 flex items-end justify-center leading-4 text-gray-600 dark:text-gray-300'>
              {estimate ?? 0}
            </p>
            <span>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-gray-600 dark:text-gray-500'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                />
              </svg>
            </span>
          </div>
        </div>
      </a>
    </li>
  );
};

export default ShortcutCard;
