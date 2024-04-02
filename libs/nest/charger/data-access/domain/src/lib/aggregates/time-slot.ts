


export type TimeSlotProps = {
  /** aggregate PK */
  readonly from: Date;
  readonly to: Date;
  readonly charger_id: string;
  readonly user_id: string;
}

export class TimeSlot implements TimeSlotProps {
  from!: Date;
  to!: Date;
  charger_id!: string;
  user_id!: string;

  constructor(props: TimeSlotProps) {
    Object.assign(this, props);
  }
}
