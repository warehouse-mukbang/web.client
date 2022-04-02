import { LoaderFunction, redirect } from 'remix';

import APIService from '~/services/api-service';
import FirebaseService from '~/services/database-service';
import GithubService from '~/services/github-service';

export const loader: LoaderFunction = async ({ request }) => {
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

  const github_user = await github.get_user(access_token);

  if (!github_user.username) {
    return {
      success: false,
      error: 'Invalid Github User',
      data: null,
    };
  }

  const firebase = new FirebaseService();

  const user = await firebase.create_user({
    oauth_token: access_token,
    service: 'GitHub',
    username: github_user.username,
  });

  if (!user) {
    return {
      success: false,
      error: 'User already exists',
      data: null,
    };
  }

  return redirect(
    `${process.env.BASE_URL}?authorize=true&platform=github&token=${user.id}`
  );
};
