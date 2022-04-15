import { LoaderFunction } from 'remix';

import APIService from '~/services/api-service';
import FirebaseService from '~/services/database-service';
import GithubService from '~/services/github-service';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const auth_id = url.searchParams.get('auth_id');

  if (!auth_id) {
    return {
      success: false,
      error: 'auth_id not found',
      data: null,
    };
  }

  const firebase = new FirebaseService();

  const user = await firebase.get_user_by_id(auth_id);

  if (!user) {
    return {
      success: false,
      error: 'User not found',
      data: null,
    };
  }

  const github = new GithubService(new APIService(), user);

  const data = await github.get_issues();

  return {
    success: true,
    error: null,
    body: data,
  };
};
