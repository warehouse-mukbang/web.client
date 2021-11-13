import type { API } from '~/types/api';
import { Bug } from '~/types/cards/bugsnag';
import type { APIService } from './api-service.d';

class BugSnagService implements APIService {
  constructor(private readonly api: API) {}

  async get(): Promise<{ bugs: Bug[]; error?: boolean }> {
    const bugs = await (
      await fetch(
        `https://api.bugsnag.com/projects/${process.env.BUGSNAG_PROJECT_ID}/errors?filters[error.status]=new&filters[event.since]=1d&filters[app.release_stage]=production&sort=events`,
        {
          headers: {
            Authorization: `token ${process.env.BUGSNAG_TOKEN}`,
          },
        }
      )
    ).json();

    if (bugs.errors) {
      return {
        bugs: [],
        error: true,
      };
    }

    return {
      bugs: bugs.map((bug: any) => ({
        id: bug.id,
        message: bug.message,
        events: bug.events,
        error_class: bug.error_class,
        severity: bug.severity,
        path: bug.context,
        url: `https://app.bugsnag.com/${process.env.BUGSNAG_ORGANIZATION_NAME}/${process.env.BUGSNAG_PROJECT_NAME}/errors/${bug.id}`,
      })),
    };
  }
}

export default BugSnagService;
