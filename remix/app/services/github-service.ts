import {
  GithubPullRequests,
  GithubIssues,
  GithubUser,
  GithubService as IGithubService,
} from './github-service.d';
import type { APIService } from './api-service.d';
import { User } from './database-service.d';

class GithubService implements IGithubService {
  constructor(private readonly api: APIService, private readonly user?: User) {}

  oauth_init() {
    const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo user read:org`;

    return url;
  }

  async oauth_confirm(auth_code: string): Promise<string> {
    const url = `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${auth_code}`;

    const response = await this.api.post(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    const { access_token } = await response.json();

    return access_token;
  }

  async get_prs(): Promise<GithubPullRequests> {
    if (!this.user) {
      throw new Error('Missing or Invalid Github Authorization');
    }

    const querystring = encodeURIComponent(
      `is:open is:pr review-requested:${this.user.username} archived:false`
    );

    const data = await (
      await this.api.get(
        `https://api.github.com/search/issues?q=${querystring}&type=pr`,
        {
          headers: {
            Authorization: `token ${this.user.oauth_token}`,
          },
        }
      )
    ).json();

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

  
  async get_issues(): Promise<GithubIssues> {
    if (!this.user) {
      throw new Error('Missing or Invalid Github Authorization');
    }

    const querystring = encodeURIComponent(
      `is:open is:issue assignee:${this.user.username} archived:false`
    );

    const data = await (
      await this.api.get(
        `https://api.github.com/search/issues?q=${querystring}&type=issue`,
        {
          headers: {
            Authorization: `token ${this.user.oauth_token}`,
          },
        }
      )
    ).json();

    return {
      total_count: data.total_count,
      items: data.items?.map((item: any) => ({
        url: item.html_url,
        title: item.title,
        author: {
          image_url: item.user.avatar_url,
          name: item.user.login,
        },
        comments: item.comments,
        created_at: item.created_at,
      })),
      incomplete_results: data.incomplete_results,
    };
  }

  async get_user(access_token: string): Promise<GithubUser> {
    const response = await this.api.get(`https://api.github.com/user`, {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });

    const { login } = await response.json();

    return {
      username: login,
    };
  }
}

export default GithubService;
