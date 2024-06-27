import { Country } from "./Country";

export interface ResponseFetchCountries {
    error: boolean;
    msg: string;
    data: Country[];
}