import type { API, API_Error } from '~/types/api';
import { OnCallSchedule } from '~/types/cards/opsgenie';
import type { APIService } from './api-service.d';

class OpsGenieService implements APIService {
  constructor(
    private readonly api: API,
    private readonly schedule: string,
    private readonly token: string
  ) {}

  async get(): Promise<Partial<OnCallSchedule & API_Error>> {
    if (!this.schedule || !this.token) {
      return {
        error: true,
        service_name: 'opsgenie',
        message: 'Missing or Invalid OpsGenie schedule or token',
      };
    }

    const currentOnCall = this.api(
      `https://api.opsgenie.com/v2/schedules/${this.schedule}/on-calls`,
      {
        headers: {
          Authorization: `GenieKey ${this.token}`,
        },
      }
    );

    const nextOnCall = this.api(
      `https://api.opsgenie.com/v2/schedules/${this.schedule}/next-on-calls`,
      {
        headers: {
          Authorization: `GenieKey ${this.token}`,
        },
      }
    );

    const [currentOnCallResponse, nextOnCallResponse] = await Promise.all([
      currentOnCall,
      nextOnCall,
    ]).then(async schedules => {
      return [await schedules[0].json(), await schedules[1].json()];
    });

    const currentName = this.api(
      `https://api.opsgenie.com/v2/users/${currentOnCallResponse.data.onCallParticipants[0].id}`,
      {
        headers: {
          Authorization: `GenieKey ${this.token}`,
        },
      }
    );

    const nextName = this.api(
      `https://api.opsgenie.com/v2/users/${nextOnCallResponse.data.nextOnCallRecipients[0].id}`,
      {
        headers: {
          Authorization: `GenieKey ${this.token}`,
        },
      }
    );

    const [current, next] = await Promise.all([currentName, nextName]).then(
      async users => {
        return [await users[0].json(), await users[1].json()];
      }
    );

    return {
      current: {
        user: {
          name: current.data.fullName
        }
      },
      next: {
        user: {
          name: next.data.fullName
        }
      },
    };
  }
}

export default OpsGenieService;
