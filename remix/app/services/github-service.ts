import {
  GithubPullRequests,
  GithubIssues,
  GithubService as IGithubService,
} from './github-service.d';
import type { APIService } from './api-service.d';

class GithubService implements IGithubService {
  constructor(
    private readonly api: APIService,
    private readonly username: string,
    private readonly token: string
  ) {}

  oauth_init() {
    const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo user read:org`;

    return url;
  }

  async oauth_confirm(auth_code: string): Promise<boolean> {
    const url = `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${auth_code}`;

    const response = await this.api.post(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    const { access_token } = await response.json();

    console.log('access_token', access_token);

    // todo: update database

    return true;
  }

  async get_prs(): Promise<GithubPullRequests> {
    if (!this.username || !this.token) {
      throw new Error('Missing or Invalid Github username or token');
    }

    const querystring = encodeURIComponent(
      `is:open is:pr review-requested:${this.username} archived:false`
    );

    const data = await (
      await this.api.get(
        `https://api.github.com/search/issues?q=${querystring}&type=pr`,
        {
          headers: {
            Authorization: `token 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`,
          },
        }
      )
    ).json();

    console.log('data', data);

    return {
      pr_count: data.total_count,
      open_prs: data.items?.map((item: any) => ({
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

  // TODO: IMPLEMENT THIS
  async get_issues(): Promise<GithubIssues> {
    return {};
  }
}

export default GithubService;
