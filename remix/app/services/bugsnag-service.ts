import type { API, API_Error } from '~/types/api';
import { Bug } from '~/types/services/bugsnag';
import type { APIService } from './api-service.d';

class BugSnagService implements APIService {
  constructor(
    private readonly api: API,
    private readonly organization_name: string,
    private readonly project_name: string,
    private readonly project_id: string,
    private readonly token: string
  ) {}

  async get(): Promise<Partial<{ bugs: Bug[] } & API_Error>> {
    if (
      !this.organization_name ||
      !this.project_name ||
      !this.project_id ||
      !this.token
    ) {
      return {
        error: true,
        service_name: 'bugsnag',
        message:
          'Missing or Invalid BugSnag organization_name, project_name, project_id or token',
      };
    }

    const bugs = await (
      await this.api(
        `https://api.bugsnag.com/projects/${this.project_id}/errors?filters[error.status]=new&filters[event.since]=1d&filters[app.release_stage]=production&sort=events`,
        {
          headers: {
            Authorization: `token ${this.token}`,
          },
        }
      )
    ).json();

    if (bugs.errors) {
      return {
        error: true,
        service_name: 'bugsnag',
        message: bugs.errors[0].message,
      };
    }

    return {
      bugs: bugs?.map((bug: any) => ({
        id: bug.id,
        message: bug.message,
        events: bug.events,
        error_class: bug.error_class,
        severity: bug.severity,
        path: bug.context,
        url: `https://app.bugsnag.com/${this.organization_name}/${this.project_name}/errors/${bug.id}`,
      })),
    };
  }
}

export default BugSnagService;
