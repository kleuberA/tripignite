"use client"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ResponseFetchCountries } from "@/types/Countries";
import { CalendarIcon, LoaderCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import { useEffect, useState } from "react";
import { addDays, format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import axios from "axios";

const fetchCountries = async () => {
    const response = await axios.get('https://countriesnow.space/api/v0.1/countries');
    return response.data;
};


export default function AdicionarPlanejamento() {

    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 10),
    })

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
                    <div className={cn("grid gap-2")}>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    className={cn(
                                        "w-[300px] justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date?.from ? (
                                        date.to ? (
                                            <>
                                                {format(date.from, "LLL dd, y")} -{" "}
                                                {format(date.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(date.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={date?.from}
                                    selected={date}
                                    onSelect={setDate}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                        {(date?.from?.getDate() || 0) > (date?.to?.getDate() || 0) ? (
                            <p className="">Sua viagem será de {(date?.from?.getDate() || 0) - (date?.to?.getDate() || 0)} dia(s).</p>
                        ) : (
                            <p>Sua viagem será de {(date?.to?.getDate() || 0) - (date?.from?.getDate() || 0)} dia(s).</p>
                        )}
                    </div>
                    <div>
                        <Label>Orçamento</Label>
                        <Input type="number" className="input" placeholder="Orçamento" />
                    </div>
                    <div>
                        <Label>Descrição</Label>
                        <Input className="input" placeholder="Descrição" />
                    </div>
                    <div>
                        <Button variant="default">Criar Planejamento</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}