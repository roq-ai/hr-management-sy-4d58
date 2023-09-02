import { SongInterface } from 'interfaces/song';
import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface Mp3PlayerInterface {
  id?: string;
  model: string;
  manufacturer: string;
  storage_capacity: number;
  battery_life: number;
  organization_id: string;
  created_at?: any;
  updated_at?: any;
  song?: SongInterface[];
  organization?: OrganizationInterface;
  _count?: {
    song?: number;
  };
}

export interface Mp3PlayerGetQueryInterface extends GetQueryInterface {
  id?: string;
  model?: string;
  manufacturer?: string;
  organization_id?: string;
}
