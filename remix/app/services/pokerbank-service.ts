import type { API, API_Error } from '~/types/api';
import { PokerBankUser } from '~/types/cards/pokerbank';
import type { APIService } from './api-service.d';

class PokerBankService implements APIService {
  constructor(private readonly api: API, private readonly token: string) {}

  async get(): Promise<Partial<{ users: PokerBankUser[] } & API_Error>> {
    if (!this.token) {
      return {
        error: true,
        service_name: 'pokerbank',
        message: 'Missing or Invalid PokerBank token',
      };
    }

    const users = await (
      await this.api(`https://poker-bank.fly.dev/api/users?limit=3`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
    ).json();

    return users;
  }
}

export default PokerBankService;
