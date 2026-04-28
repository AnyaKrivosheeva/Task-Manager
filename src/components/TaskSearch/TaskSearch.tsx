import { useEffect, useState } from "react";
import { useDebounce } from "../../shared/hooks/useDebounce";
import styles from "./TaskSearch.module.css";

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
            className={styles.input}
        />
    );
}