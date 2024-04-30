

export type GetUserByIdQueryProps = {
  user_id: string;
}

export type GetUserByIdQueryResult = {
  id: string;
  name: string;
}[];


export class GetUserByIdQuery implements GetUserByIdQueryProps {
  constructor(readonly user_id: string){}
}
