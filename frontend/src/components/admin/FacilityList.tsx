"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ListFilter, RefreshCw } from "lucide-react";
import { FacilitiesService } from "@/api/services/FacilitiesService";
import type { FacilityResponse } from "@/api/models/FacilityResponse";
import { CareType } from "@/api/models/CareType";
import { CapacityType } from "@/api/models/CapacityType";

export function FacilityList() {
    const [isOpen, setIsOpen] = useState(false);
    const [facilities, setFacilities] = useState<FacilityResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const limit = 20; // Number of items per page

    const fetchFacilities = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await FacilitiesService.getFacilitiesApiV1FacilitiesGet(
                page * limit,
                limit
            );
            setFacilities(prev => page === 0 ? data : [...prev, ...data]);
        } catch (err) {
            setError("Failed to load facilities");
            console.error("Error fetching facilities:", err);
        } finally {
            setIsLoading(false);
        }
    }, [page, limit]);

    const handleRefresh = useCallback(() => {
        setPage(0);
        setFacilities([]);
        fetchFacilities();
    }, [fetchFacilities]);

    const loadMore = useCallback(() => {
        setPage(prev => prev + 1);
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchFacilities();
        }
    }, [isOpen, fetchFacilities, page]);

    const careTypeLabels: Record<CareType, string> = {
        [CareType.STATIONARY]: "Stationary",
        [CareType.AMBULATORY]: "Ambulatory",
        [CareType.DAY_CARE]: "Day Care"
    };

    const capacityLabels: Record<CapacityType, string> = {
        [CapacityType.AVAILABLE]: "Available",
        [CapacityType.FULL]: "Full"
    };

    const capacityColors: Record<CapacityType, string> = {
        [CapacityType.AVAILABLE]: "text-green-600 dark:text-green-400",
        [CapacityType.FULL]: "text-red-600 dark:text-red-400"
    };

    return (
        <TooltipProvider>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="rounded-full h-8 w-8 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-800/50"
                            onClick={() => setIsOpen(true)}
                            aria-label="List Facilities"
                        >
                            <ListFilter className="h-4 w-4" />
                            <span className="sr-only">List Facilities</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>List Facilities</p>
                    </TooltipContent>
                </Tooltip>
                <DialogContent className="sm:max-w-[600px] p-6">
                    <DialogHeader className="mb-4 flex justify-between items-center">
                        <DialogTitle className="text-xl font-semibold">All Facilities</DialogTitle>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleRefresh}
                            className="h-8 w-8"
                            disabled={isLoading}
                            aria-label="Refresh facilities list"
                        >
                            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                            <span className="sr-only">Refresh</span>
                        </Button>
                    </DialogHeader>

                    <div className="overflow-y-auto max-h-[60vh]">
                        {isLoading && facilities.length === 0 ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-8 text-red-600 dark:text-red-400">
                                {error}
                                <Button
                                    variant="outline"
                                    className="mt-4 mx-auto block"
                                    onClick={handleRefresh}
                                >
                                    Try Again
                                </Button>
                            </div>
                        ) : facilities.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No facilities found.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {facilities.map((facility) => (
                                    <div
                                        key={facility.id}
                                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                                    >
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-medium text-lg">{facility.name}</h3>
                                            <span className={`text-sm font-medium ${capacityColors[facility.capacity]}`}>
                                                {capacityLabels[facility.capacity]}
                                            </span>
                                        </div>
                                        <div className="mt-2 space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
                                            <p>Facility Zip Code: {facility.zip_code}</p>
                                            <p>Care Types: {facility.care_types?.map(type => careTypeLabels[type]).join(", ") || "None"}</p>
                                            <div>
                                                <p className="text-gray-900 dark:text-gray-100 font-medium mb-1">Service Area:</p>
                                                {facility.zip_code_ranges && facility.zip_code_ranges.length > 0 ? (
                                                    <ul className="list-disc list-inside pl-1 space-y-0.5">
                                                        {facility.zip_code_ranges.map((range, index) => (
                                                            <li key={index}>
                                                                {range.min_zip_code} - {range.max_zip_code}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="italic">No service area defined</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {facilities.length >= (page + 1) * limit && (
                                    <Button
                                        variant="outline"
                                        className="w-full mt-4"
                                        onClick={loadMore}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Loading...' : 'Load More'}
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </TooltipProvider>
    );
} 