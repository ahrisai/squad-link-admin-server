import { Cs2Data } from '../queryTypes.js';

export default function faceitParser(text: string) {
  const pattern = /Matches: (\d+)ELO: (\d+)K\/D: ([0-9.]+)Winrt: ([0-9.]+)%Wins: (\d+)HS: ([0-9.]+)%/;

  const match = text.match(pattern);

  if (match) {
    const matchesObject = {
      matches: parseInt(match[1]),
      elo: parseInt(match[2]),
      kd: parseFloat(match[3]),
      winrate: parseFloat(match[4]),
      wins: parseInt(match[5]),
      hs: parseFloat(match[6]),
    } as Cs2Data;
    return matchesObject;
  } else {
    return null;
  }
}
