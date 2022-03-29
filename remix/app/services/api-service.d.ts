interface APIService {
  get(url: RequestInfo, init?: Omit<RequestInit, 'method'>): Promise<Response>;
  post(url: RequestInfo, init?: Omit<RequestInit, 'method'>): Promise<Response>;
}

export { APIService };
