import type { API } from '~/types/api';
import { Post } from '~/types/cards/reddit';
import type { APIService } from './api-service.d';

class RedditService implements APIService {
  constructor(private readonly api: API) {}

  async get(): Promise<Post> {
    const resp = await (
      await this.api(`https://www.reddit.com/r/programmerhumor/hot.json?count=1`)
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
