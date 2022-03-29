interface OpenPR {
  url: string;
  title: string;
  author: {
    image_url: string;
    name: string;
  };
  comments: number;
  created_at: string;
}

interface GithubData {
  pr_count: number;
  open_prs: OpenPR[];
}

export { OpenPR, GithubData };
