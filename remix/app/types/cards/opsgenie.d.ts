interface OnCallUser {
  name: string;
}

interface OnCall {
  user: OnCallUser;
}

interface OnCallSchedule {
  current: OnCall;
  next: OnCall;
}

export { OnCallSchedule, OnCall, OnCallUser };
