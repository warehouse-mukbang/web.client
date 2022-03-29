import { LoaderFunction } from 'remix';

import APIService from '~/services/api-service';
import FirebaseService from '~/services/database-service';
import GithubService from '~/services/github-service';

export const loader: LoaderFunction = async () => {
  // TODO remove check
  if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_USERNAME) {
    return {
      success: false,
      error: 'GITHUB_TOKEN and GITHUB_USERNAME must be set',
      data: null,
    };
  }

  const firebase = new FirebaseService()

  // TODO replace with username or id from client
  const user = await firebase.get_user_by_username(process.env.GITHUB_USERNAME);

  if (!user) {
    return {
      success: false,
      error: 'User not found',
      data: null,
    };
  }

  const github = new GithubService(new APIService(), user);

  const data = await github.get_prs();

  return {
    success: true,
    error: null,
    body: data,
  };
};
