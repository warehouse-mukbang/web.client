import type { API, API_Error } from '~/types/api';
import { GithubData } from '~/types/cards/github';
import type { APIService } from './api-service.d';

class GithubService implements APIService {
  constructor(
    private readonly api: API,
    private readonly username: string,
    private readonly token: string
  ) {}

  async get(): Promise<Partial<GithubData & API_Error>> {
    if (!this.username || !this.token) {
      return {
        error: true,
        service_name: 'github',
        message: 'Missing or Invalid Github username or token',
      };
    }

    const querystring = encodeURIComponent(
      `is:open is:pr review-requested:${this.username} archived:false`
    );

    const data = await (
      await this.api(
        `https://api.github.com/search/issues?q=${querystring}&type=pr`,
        {
          headers: {
            Authorization: `token ${this.token}`,
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
