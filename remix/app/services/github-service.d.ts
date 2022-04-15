interface PullRequest {
  url: string;
  title: string;
  author: {
    image_url: string;
    name: string;
  };
  comments: number;
  created_at: string;
}

interface GithubPullRequests {
  pr_count: number;
  open_prs: PullRequest[];
}

interface Issue {
  url: string;
  title: string;
  author: {
    name: string;
    image_url: string;
  };
  comments: number;
  created_at: string;
}
interface GithubIssues {
  total_count: number;
  items: Issue[];
  incomplete_results: boolean;
}
interface GithubUser {
  username: string;
}

interface GithubService {
  oauth_init(): void;
  oauth_confirm(auth_code: string): Promise<string>;

  get_prs(): Promise<GithubPullRequests>;
  get_issues(): Promise<GithubIssues>;
  get_user(access_token: string): Promise<GithubUser>;
}

export {
  PullRequest,
  GithubPullRequests,
  Issue,
  GithubIssues,
  GithubUser,
  GithubService,
};
