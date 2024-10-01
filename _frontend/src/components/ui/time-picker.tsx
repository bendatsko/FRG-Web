import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

// Utility types and functions
type Period = "AM" | "PM";
type TimePickerType = "hours" | "minutes" | "seconds" | "12hours";

const getDateByType = (date: Date, type: TimePickerType): string => {
    switch (type) {
        case "hours":
            return date.getHours().toString().padStart(2, "0");
        case "minutes":
            return date.getMinutes().toString().padStart(2, "0");
        case "seconds":
            return date.getSeconds().toString().padStart(2, "0");
        case "12hours":
            return (date.getHours() % 12 || 12).toString().padStart(2, "0");
    }
};

const setDateByType = (date: Date, value: string, type: TimePickerType, period?: Period): Date => {
    const newDate = new Date(date);
    const intValue = parseInt(value);
    switch (type) {
        case "hours":
            newDate.setHours(intValue);
            break;
        case "minutes":
            newDate.setMinutes(intValue);
            break;
        case "seconds":
            newDate.setSeconds(intValue);
            break;
        case "12hours":
            let hours = intValue;
            if (period === "PM" && hours !== 12) hours += 12;
            if (period === "AM" && hours === 12) hours = 0;
            newDate.setHours(hours);
            break;
    }
    return newDate;
};

const getArrowByType = (value: string, step: number, type: TimePickerType): string => {
    const intValue = parseInt(value);
    let newValue: number;
    switch (type) {
        case "hours":
            newValue = (intValue + step + 24) % 24;
            break;
        case "minutes":
        case "seconds":
            newValue = (intValue + step + 60) % 60;
            break;
        case "12hours":
            newValue = ((intValue - 1 + step + 12) % 12) + 1;
            break;
    }
    return newValue.toString().padStart(2, "0");
};

// TimePickerInput component
interface TimePickerInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    picker: TimePickerType;
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    period?: Period;
    onRightFocus?: () => void;
    onLeftFocus?: () => void;
}

const TimePickerInput = React.forwardRef<HTMLInputElement, TimePickerInputProps>(
    ({ className, type = "tel", value, id, name, date = new Date(), setDate, onChange, onKeyDown, picker, period, onLeftFocus, onRightFocus, ...props }, ref) => {
        const [flag, setFlag] = useState<boolean>(false);
        const [prevIntKey, setPrevIntKey] = useState<string>("0");

        React.useEffect(() => {
            if (flag) {
                const timer = setTimeout(() => {
                    setFlag(false);
                }, 2000);
                return () => clearTimeout(timer);
            }
        }, [flag]);

        const calculatedValue = React.useMemo(() => {
            return getDateByType(date, picker);
        }, [date, picker]);

        const calculateNewValue = (key: string) => {
            if (picker === "12hours") {
                if (flag && calculatedValue.slice(1, 2) === "1" && prevIntKey === "0")
                    return "0" + key;
            }
            return !flag ? "0" + key : calculatedValue.slice(1, 2) + key;
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Tab") return;
            e.preventDefault();
            if (e.key === "ArrowRight") onRightFocus?.();
            if (e.key === "ArrowLeft") onLeftFocus?.();
            if (["ArrowUp", "ArrowDown"].includes(e.key)) {
                const step = e.key === "ArrowUp" ? 1 : -1;
                const newValue = getArrowByType(calculatedValue, step, picker);
                if (flag) setFlag(false);
                const tempDate = new Date(date);
                setDate(setDateByType(tempDate, newValue, picker, period));
            }
            if (e.key >= "0" && e.key <= "9") {
                if (picker === "12hours") setPrevIntKey(e.key);
                const newValue = calculateNewValue(e.key);
                if (flag) onRightFocus?.();
                setFlag((prev) => !prev);
                const tempDate = new Date(date);
                setDate(setDateByType(tempDate, newValue, picker, period));
            }
        };

        return (
            <Input
                ref={ref}
                id={id || picker}
                name={name || picker}
                className={cn(
                    "w-[48px] text-center font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none",
                    className
                )}
                value={value || calculatedValue}
                onChange={(e) => {
                    e.preventDefault();
                    onChange?.(e);
                }}
                type={type}
                inputMode="decimal"
                onKeyDown={(e) => {
                    onKeyDown?.(e);
                    handleKeyDown(e);
                }}
                {...props}
            />
        );
    }
);

TimePickerInput.displayName = "TimePickerInput";

// Main TimePicker component
interface TimePickerProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    label?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({ date, setDate, label }) => {
    const [period, setPeriod] = useState<Period>(date && date.getHours() >= 12 ? "PM" : "AM");

    const refs = {
        hours: React.useRef<HTMLInputElement>(null),
        minutes: React.useRef<HTMLInputElement>(null),
        seconds: React.useRef<HTMLInputElement>(null),
    };

    const focusRef = (ref: keyof typeof refs) => {
        refs[ref].current?.focus();
    };

    const handlePeriodChange = () => {
        const newPeriod = period === "AM" ? "PM" : "AM";
        setPeriod(newPeriod);
        if (date) {
            const newDate = new Date(date);
            if (newPeriod === "PM" && newDate.getHours() < 12) {
                newDate.setHours(newDate.getHours() + 12);
            } else if (newPeriod === "AM" && newDate.getHours() >= 12) {
                newDate.setHours(newDate.getHours() - 12);
            }
            setDate(newDate);
        }
    };

    return (
        <div className="flex flex-col space-y-2">
            {label && <Label>{label}</Label>}
            <div className="flex items-center space-x-2">
                <TimePickerInput
                    picker="hours"
                    date={date}
                    setDate={setDate}
                    ref={refs.hours}
                    onRightFocus={() => focusRef("minutes")}
                />
                <span className="text-sm text-gray-500">:</span>
                <TimePickerInput
                    picker="minutes"
                    date={date}
                    setDate={setDate}
                    ref={refs.minutes}
                    onLeftFocus={() => focusRef("hours")}
                    onRightFocus={() => focusRef("seconds")}
                />
                <span className="text-sm text-gray-500">:</span>
                <TimePickerInput
                    picker="seconds"
                    date={date}
                    setDate={setDate}
                    ref={refs.seconds}
                    onLeftFocus={() => focusRef("minutes")}
                />
                <button
                    type="button"
                    className="px-2 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded"
                    onClick={handlePeriodChange}
                >
                    {period}
                </button>
            </div>
        </div>
    );
};