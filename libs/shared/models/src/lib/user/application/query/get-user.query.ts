

export type GetUserQueryProps = {}

export type GetUserQueryResult = {
  id: string;
  name: string;
}[];

export class GetUserQuery implements GetUserQueryProps {
  constructor(props: GetUserQueryProps){
    Object.assign(this, props);
  }
}
