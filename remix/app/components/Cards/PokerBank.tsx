import { PokerBankUser } from '~/types/cards/pokerbank';

import * as Card from '../Card';

const PokerBank: React.FC<{ users: PokerBankUser[] }> = ({ users }) => {
  const formatBank = (bank: PokerBankUser['bank']) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'symbol',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(bank);
  };

  return (
    <Card.Base size='small'>
      <Card.Header title='PokerBank Podium' />

      <div className='w-full h-[70%] flex flex-row items-end justify-around pt-4'>
        <div className='rounded-t-lg flex-col items-center justify-between w-24 h-[75%] flex bg-gray-300 p-4'>
          <img
            className='h-12 w-12 rounded-full'
            src={users[1].imageUrl}
            alt='silver place'
          />

          <p className='text-gray-600'>{formatBank(users[1].bank)}</p>
        </div>

        <div className='rounded-t-lg items-center justify-between w-24 h-full flex flex-col bg-yellow-300 bg-opacity-70 p-4'>
          <img
            className='h-12 w-12 rounded-full'
            src={users[0].imageUrl}
            alt='gold place'
          />

          <p className='text-gray-600'>{formatBank(users[0].bank)}</p>
        </div>

        <div className='rounded-t-lg items-center justify-between w-24 h-[60%] flex flex-col bg-yellow-800 bg-opacity-30 p-4'>
          <img
            className='h-12 w-12 rounded-full'
            src={users[2].imageUrl}
            alt='bronze place'
          />

          <p className='text-gray-600'>{formatBank(users[2].bank)}</p>
        </div>
      </div>
    </Card.Base>
  );
};

export default PokerBank;
