export interface RemoveChargerCommandProps {
  readonly id: string;
}

export type RemoveChargerCommandResult = void;

export class RemoveChargerCommand implements RemoveChargerCommandProps {
  constructor(readonly id: string) {}
}
