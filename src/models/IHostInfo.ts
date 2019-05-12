export interface IHostApi {
  hosts: IHostInfo[];
  defaultPushHostId: string | undefined;
}

export class IHostTypes {
  static readonly DIGITAL_OCEAN_HOST = "DIGITAL_OCEAN_HOST";
}

type IHostType = "DIGITAL_OCEAN_HOST";

export interface IHostInfo {
  id: string;
  name: string;
  token: string;
  hostAuthClientId: string;
  hostAuthRedirectUri: string;
  hostAuthType: string;
  hostAuthScope: string;
  hostAuthState: string;
  hostType: IHostType;
}
