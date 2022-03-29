import { LoaderFunction } from 'remix';

import APIService from '~/services/api-service';
import GithubService from '~/services/github-service';

export const loader: LoaderFunction = async ({ request }) => {
  if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_USERNAME) {
    return {
      success: false,
      error: 'GITHUB_TOKEN and GITHUB_USERNAME must be set',
      data: null,
    };
  }

  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return {
      success: false,
      error: 'Missing auth code',
      data: null,
    };
  }

  const github = new GithubService(
    new APIService(),
    process.env.GITHUB_USERNAME,
    process.env.GITHUB_TOKEN
  );

  await github.oauth_confirm(code);

  return {
    success: true,
    error: null,
    data: null,
  };
};
