import { useEffect, useState } from "react";
import { useDebounce } from "../../shared/hooks/useDebounce";

type Props = {
    value: string;
    onChange: (value: string) => void;
};

export default function TaskSearch({ value, onChange }: Props) {
    const [localValue, setLocalValue] = useState(value);

    const debouncedValue = useDebounce(localValue, 300);

    useEffect(() => {
        onChange(debouncedValue);
    }, [debouncedValue, onChange]);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    return (
        <input
            type="text"
            placeholder="Найти делишки..."
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            style={{
                padding: "5px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                outline: "none",
            }}
        />
    );
}