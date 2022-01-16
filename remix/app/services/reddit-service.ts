import type { API, API_Error } from '~/types/api';
import { Post } from '~/types/cards/reddit';
import type { APIService } from './api-service.d';

class RedditService implements APIService {
  constructor(private readonly api: API, private readonly subreddit: string) {}

  async get(): Promise<Partial<Post & API_Error>> {
    if (!this.subreddit) {
      return {
        error: true,
        service_name: 'reddit',
        message: 'Missing or Invalid Reddit subreddit',
      };
    }

    const resp = await (
      await this.api(
        `https://www.reddit.com/r/${this.subreddit}/hot.json?count=1`
      )
    ).json();

    const post = resp.data.children[0]?.data ?? {};

    return {
      title: post.title,
      media_url: !post.is_video
        ? post.url
        : post.media.reddit_video.fallback_url,
      is_video: post.is_video,
    };
  }
}

export default RedditService;
