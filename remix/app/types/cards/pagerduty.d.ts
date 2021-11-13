interface OnCallUser {
  id: string;
  html_url: string;
  self: string;
  summary: string;
  type: string;
}

interface OnCall {
  start: string | Date;
  end: string | Date;
  id: string;
  user: OnCallUser;
}

interface OnCallSchedule {
  current: OnCall;
  next: OnCall;
}

export { OnCallSchedule, OnCall, OnCallUser };
