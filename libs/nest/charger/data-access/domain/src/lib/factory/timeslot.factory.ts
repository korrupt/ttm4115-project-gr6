import { TimeSlot, TimeSlotProps } from "../aggregates";

export class TimeSlotFactory {

  static reconstitute(props: TimeSlotProps): TimeSlot {
    return new TimeSlot(props);
  }

}
