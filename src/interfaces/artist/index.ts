import { SongInterface } from 'interfaces/song';
import { GetQueryInterface } from 'interfaces';

export interface ArtistInterface {
  id?: string;
  name: string;
  birth_date: any;
  genre: string;
  debut_year: number;
  song_id: string;
  created_at?: any;
  updated_at?: any;

  song?: SongInterface;
  _count?: {};
}

export interface ArtistGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  genre?: string;
  song_id?: string;
}
