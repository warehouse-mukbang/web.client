import type { API, API_Error } from '~/types/api';
import { OnCallSchedule } from '~/types/services/opsgenie';

class OpsGenieService {
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

    const currentResponses = currentOnCallResponse.data.onCallParticipants?.map(
      (participant: any) => {
        return this.api(`https://api.opsgenie.com/v2/users/${participant.id}`, {
          headers: {
            Authorization: `GenieKey ${this.token}`,
          },
        });
      }
    );

    const nextResponses = nextOnCallResponse.data.nextOnCallRecipients?.map(
      (participant: any) => {
        return this.api(`https://api.opsgenie.com/v2/users/${participant.id}`, {
          headers: {
            Authorization: `GenieKey ${this.token}`,
          },
        });
      }
    );

    const currentUsers = await Promise.all(currentResponses).then(
      async responses => {
        return await responses?.map(async response => await response.json());
      }
    );

    const nextUsers = await Promise.all(nextResponses).then(async responses => {
      return await responses?.map(async response => await response.json());
    });

    const currentUserResponses = await Promise.all(currentUsers);
    const nextUserResponses = await Promise.all(nextUsers);

    const timeline = await this.api(
      `https://api.opsgenie.com/v2/schedules/${this.schedule}/timeline?interval=2&intervalUnit=weeks`,
      {
        headers: {
          Authorization: `GenieKey ${this.token}`,
        },
      }
    ).then(async response => await response.json());

    return {
      current: currentUserResponses?.map((user, index) => {
        const periods = timeline.data.finalTimeline.rotations[index]
          .periods as Array<any>;

        const endDate = periods
          .reverse()
          .find(period => period.recipient.id === user.data.id)?.endDate;

        return {
          user: {
            name: user.data.fullName,
            endDate: endDate || undefined,
          },
        };
      }),
      next: nextUserResponses?.map((user, index) => {
        const periods = timeline.data.finalTimeline.rotations[index]
          .periods as Array<any>;

        const endDate = periods
          .reverse()
          .find(
            period =>
              period.recipient.id === user.data.id &&
              period.type !== 'historical'
          )?.endDate;

        return {
          user: {
            name: user.data.fullName,
            endDate: endDate || undefined,
          },
        };
      }),
    };
  }
}

export default OpsGenieService;
