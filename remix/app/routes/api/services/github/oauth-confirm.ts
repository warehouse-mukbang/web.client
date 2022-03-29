import { LoaderFunction } from 'remix';

import APIService from '~/services/api-service';
import FirebaseService from '~/services/database-service';
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

  const github = new GithubService(new APIService());

  const access_token = await github.oauth_confirm(code);

  if (!access_token) {
    return {
      success: false,
      error: 'Invalid auth code',
      data: null,
    };
  }

  const firebase = new FirebaseService();

  // TODO get username from client
  const user = await firebase.create_user({
    oauth_token: access_token,
    service: 'GitHub',
    username: process.env.GITHUB_USERNAME,
  });

  if (!user) {
    return {
      success: false,
      error: 'User already exists',
      data: null,
    };
  }

  return {
    success: true,
    error: null,
    data: {
      user,
    },
  };
};
