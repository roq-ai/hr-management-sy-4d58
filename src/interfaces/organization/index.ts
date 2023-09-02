import { CollectionInterface } from 'interfaces/collection';
import { Mp3PlayerInterface } from 'interfaces/mp-3-player';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface OrganizationInterface {
  id?: string;
  description?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  collection?: CollectionInterface[];
  mp3_player?: Mp3PlayerInterface[];
  user?: UserInterface;
  _count?: {
    collection?: number;
    mp3_player?: number;
  };
}

export interface OrganizationGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
