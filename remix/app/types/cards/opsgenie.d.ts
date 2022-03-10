interface OnCallUser {
  name: string;
  endDate?: date;
}

interface OnCall {
  user: OnCallUser;
}

interface OnCallSchedule {
  current: OnCall[];
  next: OnCall[];
}

export { OnCallSchedule, OnCall, OnCallUser };
