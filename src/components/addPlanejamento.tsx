"use client"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ResponseFetchCountries } from "@/types/Countries";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import axios from "axios";
import { Label } from "./ui/label";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";

const fetchCountries = async () => {
    const response = await axios.get('https://countriesnow.space/api/v0.1/countries');
    return response.data;
};


export default function AdicionarPlanejamento() {

    const { data, isLoading, error } = useQuery<ResponseFetchCountries>({
        queryKey: ['countries'],
        queryFn: fetchCountries
    });
    const [country, setCountry] = useState<string>();

    const fetchCities = async () => {
        if (country) {
            const response = await axios.post(
                'https://countriesnow.space/api/v0.1/countries/cities',
                {
                    country: country
                }
            );
            return response.data;
        }
    }

    const { data: dataCities, isLoading: isLoadingCities, error: errorCities, refetch } = useQuery({
        queryKey: ['cities', country],
        queryFn: () => fetchCities(),
        enabled: !!country
    });

    useEffect(() => {
        if (country) {
            refetch();
        }
    }, [country, refetch]);


    if (isLoading) return <div><LoaderCircle className="animate-spin" /></div>
    if (error) return <div>Error: {error.message}</div>

    return (
        <Dialog >
            <DialogTrigger>
                <Button variant="default">Criar Planejamento</Button>
            </DialogTrigger>
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle>Crie seu planejamento de viagem</DialogTitle>
                    <DialogDescription>
                        Preencha os campos abaixo para criar seu planejamento de viagem.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-5">
                    <div className="flex flex-row w-full justify-between items-center">
                        <div className="flex flex-col gap-5">
                            <Label>Countries</Label>
                            <Select onValueChange={(e) => setCountry(e)}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Select a country" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Countries</SelectLabel>
                                        {data && (
                                            data.data.map((country) => (
                                                <SelectItem key={country.country} value={country.country}>{country.country}</SelectItem>
                                            ))
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        {country && !isLoadingCities && (
                            <div className="flex flex-col gap-5">
                                <Label>City</Label>
                                <Select>
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="Select a city" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Cities</SelectLabel>
                                            {dataCities && (
                                                dataCities.data.map((city: any) => (
                                                    <SelectItem key={city} value={city}>{city}</SelectItem>
                                                ))
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        {isLoadingCities && (
                            <div className="flex items-center justify-center w-full h-12">
                                <LoaderCircle className="animate-spin" />
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}