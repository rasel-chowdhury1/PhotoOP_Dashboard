/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../select";

interface YearOptionProps {
    currentYear: number;
    setThisYear: (year: any) => void;
    className?: string;
}

interface YearOption {
    value: string;
    label: string;
}

const YearOption: React.FC<YearOptionProps> = ({
    currentYear,
    setThisYear,
    className = "",
}) => {
    const [yearOptions, setYearOptions] = useState<YearOption[]>([]);
    const defaultYear = currentYear.toString();

    useEffect(() => {
        const startYear = 2025;
        const yearRange: YearOption[] = [];

        // Add the years to the list
        for (let i = startYear; i <= currentYear; i++) {
            yearRange.push({ value: i.toString(), label: i.toString() });
        }

        setYearOptions(yearRange);
    }, [currentYear]);

    return (
        <Select defaultValue={defaultYear} onValueChange={setThisYear}>
            <SelectTrigger
                className={`w-[100px] bg-transparent text-[#28314e] border-[#E1E1E1] hover:bg-[#e53935]/10 focus:ring-[#e53935] ${className}`}
            >
                <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent className="bg-white border-[#E1E1E1]">
                {yearOptions.map((option) => (
                    <SelectItem
                        key={option.value}
                        value={option.value}
                        className="hover:bg-[#e53935]/10 focus:bg-[#e53935] focus:text-white"
                    >
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default YearOption;