import type { API } from '~/types/api';
import { GithubData } from '~/types/cards/github';
import type { APIService } from './api-service.d';

class GithubService implements APIService {
  constructor(private readonly api: API) {}

  async get(): Promise<GithubData> {
    const querystring = encodeURIComponent(
      `is:open is:pr review-requested:${process.env.GITHUB_USERNAME} archived:false`
    );

    const data = await (
      await this.api(
        `https://api.github.com/search/issues?q=${querystring}&type=pr`,
        {
          headers: {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          },
        }
      )
    ).json();

    return {
      pr_count: data.total_count,
      open_prs: data.items.map((item: any) => ({
        url: item.html_url,
        title: item.title,
        author: {
          image_url: item.user.avatar_url,
          name: item.user.login,
        },
        comments: item.comments,
        created_at: item.created_at,
      })),
    };
  }
}

export default GithubService;
