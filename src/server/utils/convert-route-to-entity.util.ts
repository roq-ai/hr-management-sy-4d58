const mapping: Record<string, string> = {
  artists: 'artist',
  collections: 'collection',
  'mp-3-players': 'mp3_player',
  organizations: 'organization',
  songs: 'song',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
