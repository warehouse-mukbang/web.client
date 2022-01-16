type API = (input: RequestInfo, init?: RequestInit) => Promise<Response>;
type API_Error = {
  error?: boolean;
  service_name?: string;
  message?: string;
};

export { API, API_Error };
