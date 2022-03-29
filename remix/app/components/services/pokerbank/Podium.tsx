// ================================================== //
// ============== TODO THIS IS NOT MVP ============== //
// ================================================== //

import { API_Error } from '~/types/api';
import { PokerBankUser } from '~/types/services/pokerbank';

import * as Card from '../../Card';

const PokerBank: React.FC<Partial<{ users: PokerBankUser[] }> & API_Error> = ({
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

  const { users } = props as { users: PokerBankUser[] };

  const formatBank = (bank: PokerBankUser['bank']) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'symbol',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(bank);
  };

  const formatName = (name: PokerBankUser['name']) => {
    if (name === 'Mr. Poker') {
      return name;
    }

    return name.split(' ')[0];
  };

  return (
    <Card.Base size='small'>
      <Card.Header title='PokerBank Podium' />

      <div className='w-full h-full flex flex-row items-end justify-around pt-16'>
        <div className='h-full flex flex-col items-center justify-end'>
          <p className='text-gray-600 dark:text-white pb-2'>
            {formatBank(users[1].bank)}
          </p>

          <div className='rounded-t-lg rounded-b-sm flex-col items-center justify-between w-24 h-[75%] flex bg-gray-300 dark:bg-gray-500 p-4'>
            <img
              className='h-12 w-12 rounded-full'
              src={users[1].imageUrl}
              alt='silver place'
            />

            <p className='text-gray-600 dark:text-white text-center'>
              {formatName(users[1].name)}
            </p>
          </div>
        </div>

        <div className='h-full flex flex-col items-center justify-end'>
          <p className='text-gray-600 dark:text-white pb-2'>
            {formatBank(users[0].bank)}
          </p>

          <div className='rounded-t-lg rounded-b-sm items-center justify-between w-24 h-full flex flex-col bg-yellow-300 bg-opacity-70 dark:bg-opacity-60 p-4'>
            <img
              className='h-12 w-12 rounded-full'
              src={users[0].imageUrl}
              alt='gold place'
            />

            <p className='text-gray-600 dark:text-white text-center'>
              {formatName(users[0].name)}
            </p>
          </div>
        </div>

        <div className='h-full flex flex-col items-center justify-end'>
          <p className='text-gray-600 dark:text-white pb-2'>
            {formatBank(users[2].bank)}
          </p>

          <div className='rounded-t-lg rounded-b-sm items-center justify-between w-24 h-[60%] flex flex-col bg-yellow-800 dark:bg-yellow-700 bg-opacity-30 dark:bg-opacity-60 p-4'>
            <img
              className='h-12 w-12 rounded-full'
              src={users[2].imageUrl}
              alt='bronze place'
            />

            <p className='text-gray-600 dark:text-white text-center'>
              {formatName(users[2].name)}
            </p>
          </div>
        </div>
      </div>
    </Card.Base>
  );
};

export default PokerBank;
