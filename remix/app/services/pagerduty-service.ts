import type { API } from '~/types/api';
import { OnCallSchedule } from '~/types/cards/pagerduty';
import type { APIService } from './api-service.d';

class PagerDutyService implements APIService {
  constructor(private readonly api: API) {}

  async get(): Promise<OnCallSchedule> {
    const today_start = new Date();
    const today_end = new Date();
    const start_date = new Date(
      today_start.setDate(today_start.getDate() - 14)
    );
    const end_date = new Date(today_end.setDate(today_end.getDate() + 14));

    const resp = await (
      await this.api(
        `https://api.pagerduty.com/schedules/${process.env.PAGERDUTY_SCHEDULE}?time_zone=UTC&since=${start_date}&until=${end_date}`,
        {
          headers: {
            Authorization: `Token token=${process.env.PAGERDUTY_TOKEN}`,
          },
        }
      )
    ).json();

    const scheduled_users =
      resp.schedule.final_schedule.rendered_schedule_entries;

    const current = scheduled_users.findIndex(
      (user: any) =>
        new Date(user.start) <= new Date() && new Date(user.end) >= new Date()
    );

    return {
      current: scheduled_users[current],
      next: scheduled_users[current + 1],
    };
  }
}

export default PagerDutyService;
