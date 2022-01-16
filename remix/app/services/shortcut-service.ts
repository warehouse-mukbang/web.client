import type { API, API_Error } from '~/types/api';
import { Story } from '~/types/cards/shortcut';
import type { APIService } from './api-service.d';

class ShortcutService implements APIService {
  constructor(
    private readonly api: API,
    private readonly username: string,
    private readonly token: string
  ) {}

  async get(): Promise<Partial<Story[] & API_Error>> {
    if (!this.username || !this.token) {
      return {
        error: true,
        service_name: 'shortcut',
        message: 'Missing or Invalid Shortcut username or token',
      };
    }

    const querystring = encodeURIComponent(
      `owner:${this.username} !is:done !is:archived`
    );

    const data = await (
      await this.api(
        `https://api.app.shortcut.com/api/v3/search/stories?query=${querystring}`,
        {
          headers: {
            'Shortcut-Token': this.token,
          },
        }
      )
    ).json();

    return data.data.map((story: any) => ({
      url: story.app_url,
      title: story.name,
      created_at: story.created_at,
      estimate: story.estimate,
      type: story.story_type,
    }));
  }
}

export default ShortcutService;
