import axios from 'axios';
import queryString from 'query-string';
import { ArtistInterface, ArtistGetQueryInterface } from 'interfaces/artist';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getArtists = async (query?: ArtistGetQueryInterface): Promise<PaginatedInterface<ArtistInterface>> => {
  const response = await axios.get('/api/artists', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createArtist = async (artist: ArtistInterface) => {
  const response = await axios.post('/api/artists', artist);
  return response.data;
};

export const updateArtistById = async (id: string, artist: ArtistInterface) => {
  const response = await axios.put(`/api/artists/${id}`, artist);
  return response.data;
};

export const getArtistById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/artists/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteArtistById = async (id: string) => {
  const response = await axios.delete(`/api/artists/${id}`);
  return response.data;
};
