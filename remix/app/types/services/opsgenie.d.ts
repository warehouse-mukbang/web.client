interface OnCallUser {
  name: string;
  endDate: Date;
}

interface OnCall {
  user: OnCallUser;
}

interface OnCallSchedule {
  current: OnCall[];
  next: OnCall[];
}

export { OnCallSchedule, OnCall, OnCallUser };
