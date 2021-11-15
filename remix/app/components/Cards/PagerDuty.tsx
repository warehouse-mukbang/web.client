import { OnCallSchedule, OnCall, OnCallUser } from '~/types/cards/pagerduty';

import * as Card from '../Card';

const PagerDutyCard: React.FC<OnCallSchedule> = ({ current, next }) => {
  return (
    <Card.Base size='small'>
      <Card.Header title='Current On-Call' />

      <div className='flex-1 overflow-hidden flex flex-col items-center'>
        <OnCall {...current} />
      </div>

      <Card.Header title='Next On-Call' />

      <div className='flex-1 overflow-hidden flex flex-col items-center'>
        <OnCall {...next} />
      </div>
    </Card.Base>
  );
};

const OnCall: React.FC<OnCall> = ({ start, end, user }) => {
  const formattedDate = () => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
    }).format(new Date(end));
  };
  return (
    <div className='border-b border-l border-r dark:border-gray-500 py-2 px-4 flex items-between w-full'>
      <p className='truncate w-1/2 dark:text-gray-300'>{user.summary}</p>

      <div className='flex flex-grow justify-between ml-4 items-center'>
        <p className='text-sm text-gray-500'>
          Until: <span className='text-blue-400'>{formattedDate()}</span>
        </p>
      </div>
    </div>
  );
};

export default PagerDutyCard;
