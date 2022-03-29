export interface User {
  id: string;
  oauth_token: string;
  service: 'GitHub' | 'Atlassian';
  username: string;
  name?: string;
}

export interface DatabaseService {
  create_user(arg0: Omit<User, 'id'>): Promise<User | undefined | null>;
  get_user_by_id(id: User['id']): Promise<User | undefined>;
  get_user_by_username(id: User['username']): Promise<User | undefined>;
}
