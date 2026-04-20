import React, { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

interface DateTimePickerProps {
  defaultValue?: string;
  label: string;
  name?: string;
  required?: boolean;
  onChange?: (date: string) => void;
  className?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  defaultValue,
  label,
  name,
  required,
  onChange,
  className,
}) => {
  const pad = (n: number) => (n < 10 ? `0${n}` : n);

  const getTime = (d: Date | undefined) => {
    if (!d) return "00:00:00";
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };
  const getDate = (d: Date | undefined) => {
    if (!d) return "";
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  const defaultDate = useMemo(() => {
    if (!defaultValue) return { date: "", time: "00:00:00" };
    const d =
      typeof defaultValue === "string" ? new Date(defaultValue) : defaultValue;
    return { date: getDate(d), time: getTime(d) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  const [dateOverride, setDate] = useState<string | undefined>(undefined);
  const [timeOverride, setTime] = useState<string | undefined>(undefined);
  const date = dateOverride ?? defaultDate.date;
  const time = timeOverride ?? defaultDate.time;

  const toIsoString = (time: string, date?: string) => {
    if (!date || !time) {
      return "";
    }
    try {
      return new Date(date + "T" + time).toISOString();
    } catch {
      return "";
    }
  };
  useEffect(() => {
    if (onChange && date && time) {
      onChange(toIsoString(time, date));
    }
  }, [date, time]);

  return (
    <label
      className={twMerge("flex w-full flex-col items-start gap-1", className)}
    >
      <span className="label px-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </span>
      <div className="join w-full">
        <input
          type="date"
          className="input rounded-l-field"
          name={`${name}-date`}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required={required}
        />
        <input
          type="time"
          step="1"
          className="input rounded-r-field"
          name={`${name}-time`}
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required={required}
        />
        <input type="hidden" name={name} value={toIsoString(time, date)} />
      </div>
    </label>
  );
};
