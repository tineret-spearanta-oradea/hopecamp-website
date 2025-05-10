"use client";

import { useState, useEffect } from "react";
import { Input } from "./input";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { cn } from "@/lib/utils";

// Common country codes for context
const countryCodes = [
  { code: "+4", country: "RO" },
  { code: "+1", country: "US" },
  { code: "+44", country: "UK" },
  { code: "+49", country: "DE" },
  { code: "+39", country: "IT" },
  { code: "+34", country: "ES" },
  { code: "+33", country: "FR" },
  { code: "+36", country: "HU" },
  { code: "+43", country: "AT" },
  { code: "+48", country: "PL" },
];

interface PhoneInputProps {
  value: string;
  prefix: string;
  onChange: (value: string) => void;
  onPrefixChange: (prefix: string) => void;
  label?: string;
  error?: string;
  className?: string;
  placeholder?: string;
  helpText?: string;
  disabled?: boolean;
}

export function PhoneInput({
  value,
  prefix,
  onChange,
  onPrefixChange,
  label,
  error,
  className,
  placeholder = "0770123456",
  helpText,
  disabled = false,
}: PhoneInputProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label className="text-base font-semibold">{label}</Label>}

      <div className="flex gap-2">
        <Select
          value={prefix}
          onValueChange={onPrefixChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-20 flex-shrink-0 px-2">
            <SelectValue placeholder="+4" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {countryCodes.map((country) => (
              <SelectItem
                key={country.code}
                value={country.code}
                className="flex items-center"
              >
                <span className="font-medium">{country.country}</span>
                <span className="ml-1 text-muted-foreground">
                  {country.code}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(error ? "border-destructive" : "", "flex-grow")}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>

      {error && <p className="text-destructive text-xs">{error}</p>}

      {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
    </div>
  );
}
