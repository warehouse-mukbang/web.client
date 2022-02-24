import { API_Error } from '~/types/api';
import { OnCallSchedule, OnCall } from '~/types/cards/opsgenie';

import * as Card from '../Card';

const OpsGenieCard: React.FC<Partial<OnCallSchedule & API_Error>> = ({
  children,
  ...props
}) => {
  if (props.error) {
    return (
      <Card.Base size='small'>
        <Card.Header title='Something went wrong:' subtitle={props.message} />
      </Card.Base>
    );
  }

  const { current, next } = props as OnCallSchedule;

  const currentUntil = new Date();
  currentUntil.setDate(
    currentUntil.getDate() + ((((7 - currentUntil.getDay()) % 7) + 1) % 7)
  );

  const nextUntil = new Date();
  nextUntil.setDate(
    nextUntil.getDate() + ((((7 - nextUntil.getDay()) % 7) + 1) % 7)
  );
  nextUntil.setDate(
    nextUntil.getDate() + 7
  )

  return (
    <Card.Base size='small'>
      <Card.Header title='Current On-Call' />

      <div className='flex-1 overflow-hidden flex flex-col items-center'>
        <OnCall {...current} until={currentUntil} />
      </div>

      <Card.Header title='Next On-Call' />

      <div className='flex-1 overflow-hidden flex flex-col items-center'>
        <OnCall {...next} until={nextUntil} />
      </div>
    </Card.Base>
  );
};

const OnCall: React.FC<OnCall & { until: Date }> = ({ user, until }) => {
  const formattedDate = () => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
    }).format(until);
  };

  return (
    <div className='border-b border-l border-r dark:border-gray-500 py-2 px-4 flex items-between w-full'>
      <p className='truncate w-1/2 dark:text-gray-300'>{user.name}</p>

      <div className='flex flex-grow justify-between ml-4 items-center'>
        <p className='text-sm text-gray-500'>
          Until: <span className='text-blue-400'>{formattedDate()}</span>
        </p>
      </div>
    </div>
  );
};

export default OpsGenieCard;
