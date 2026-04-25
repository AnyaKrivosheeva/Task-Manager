export const fromInputToISO = (value: string | null) => {
    if (!value) return null;

    const [datePart, timePart] = value.split("T");
    if (!datePart || !timePart) return null;

    const [year, month, day] = datePart.split("-").map(Number);
    const [hours, minutes] = timePart.split(":").map(Number);

    const localDate = new Date(year, month - 1, day, hours, minutes);

    return localDate.toISOString(); // UTC
};

export const fromISOToInput = (iso: string) => {
    const date = new Date(iso);

    const pad = (n: number) => String(n).padStart(2, "0");

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};