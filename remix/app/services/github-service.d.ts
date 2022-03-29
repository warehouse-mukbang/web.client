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

interface GithubIssues {}

interface GithubService {
  oauth_init(): void;
  oauth_confirm(auth_code: string): Promise<boolean>;

  get_prs(): Promise<GithubPullRequests>;
  get_issues(): Promise<GithubIssues>;
}

export { PullRequest, GithubPullRequests, GithubIssues, GithubService };
