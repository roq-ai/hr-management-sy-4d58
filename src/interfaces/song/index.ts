import { ArtistInterface } from 'interfaces/artist';
import { Mp3PlayerInterface } from 'interfaces/mp-3-player';
import { GetQueryInterface } from 'interfaces';

export interface SongInterface {
  id?: string;
  title: string;
  duration: number;
  genre: string;
  release_date: any;
  mp3_player_id: string;
  created_at?: any;
  updated_at?: any;
  artist?: ArtistInterface[];
  mp3_player?: Mp3PlayerInterface;
  _count?: {
    artist?: number;
  };
}

export interface SongGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  genre?: string;
  mp3_player_id?: string;
}
