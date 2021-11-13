import type { API } from '~/types/api';
import { Story } from '~/types/cards/shortcut';
import type { APIService } from './api-service.d';

class ShortcutService implements APIService {
  constructor(private readonly api: API) {}

  async get(): Promise<Story[]> {
    const querystring = encodeURIComponent(
      `owner:${process.env.SHORTCUT_USERNAME} !is:done !is:archived`
    );

    const data = await (
      await this.api(
        `https://api.app.shortcut.com/api/v3/search/stories?query=${querystring}`,
        {
          headers: {
            'Shortcut-Token': process.env.SHORTCUT_TOKEN as any,
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
