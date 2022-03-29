import { APIService as IAPIService } from './api-service.d';

class APIService implements IAPIService {
  async get(
    url: RequestInfo,
    init?: Omit<RequestInit, 'method'>
  ): Promise<Response> {
    return await fetch(url, {
      method: 'GET',
      ...init,
    });
  }

  async post(
    url: RequestInfo,
    init?: Omit<RequestInit, 'method'>
  ): Promise<Response> {
    return await fetch(url, {
      method: 'POST',
      ...init,
    });
  }
}

export default APIService;
