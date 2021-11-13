import { Post } from '~/types/cards/reddit';

import * as Card from '../Card';

const RedditCard: React.FC<{
  post: Post;
}> = ({ post }) => {
  return (
    <Card.Base size='small'>
      <Card.Header title='Your Shortcut Stories:' />

      <div className='flex-1 overflow-hidden flex flex-col items-center'>
        <TopPost {...post} />
      </div>
    </Card.Base>
  );
};

const TopPost: React.FC<Post> = ({ title, media_url, is_video }) => {
  return (
    <>
      <p className='text-md text-gray-600 py-1'>{title}</p>
      <div className='max-h-full h-[calc(100%-32px)]'>
        {is_video ? (
          <video
            src={media_url}
            className='max-h-full max-w-full object-contain'
            autoPlay
            controls
            muted
          />
        ) : (
          <img
            src={media_url}
            className='max-h-full max-w-full object-contain'
            alt='SubReddit ProgrammerHumor Post'
          />
        )}
      </div>
    </>
  );
};

export default RedditCard;
