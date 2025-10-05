import data from './asteroid-data.json';

export type Asteroid = {
    "full_name": string;
    "a": number;
    "e": number;
    "i": number;
    "om": number;
    "w": number;
    "q": number;
    "ad": number;
    "per_y": number;
    "data_arc": number;
    "condition_code": number;
    "n_obs_used": number;
    "n_del_obs_used": number | null;
    "n_dop_obs_used": number | null;
    "H": number;
    "neo": "Y" | "N";
    "pha": "Y" | "N";
}

export const asteroids: Asteroid[] = data.asteroids;
