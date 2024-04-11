import { Moment } from 'moment-timezone';


export type TimeSlotProps = {
  readonly id?: string;
  readonly from: Moment;
  readonly to: Moment;
  readonly charger_id: string;
  readonly charger_user_id: string;
}

export class TimeSlot implements TimeSlotProps {
  id?: string;
  from!: Moment;
  to!: Moment;
  charger_id!: string;
  charger_user_id!: string;

  constructor(props: TimeSlotProps) {
    Object.assign(this, props);
  }
}
