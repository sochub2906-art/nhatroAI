export type BillingPeriodValue = {
    month: number;
    year: number;
};

export function formatBillingPeriod(month: number, year: number): string {
    return `${month}/${year}`;
}

export function parseBillingPeriod(value?: string | null): BillingPeriodValue | null {
    if (!value) return null;
    const match = String(value).match(/(\d{1,2})\D+(\d{4})/);
    if (!match) return null;

    const month = Number(match[1]);
    const year = Number(match[2]);
    if (!month || month < 1 || month > 12 || !year) return null;

    return { month, year };
}

export function compareBillingPeriods(left?: string | null, right?: string | null): number {
    const leftParsed = parseBillingPeriod(left);
    const rightParsed = parseBillingPeriod(right);

    if (!leftParsed && !rightParsed) return 0;
    if (!leftParsed) return -1;
    if (!rightParsed) return 1;
    if (leftParsed.year !== rightParsed.year) return leftParsed.year - rightParsed.year;
    return leftParsed.month - rightParsed.month;
}

export function shiftBillingPeriod(value: string, monthDelta: number): string {
    const parsed = parseBillingPeriod(value);
    if (!parsed) return value;

    const date = new Date(parsed.year, parsed.month - 1 + monthDelta, 1);
    return formatBillingPeriod(date.getMonth() + 1, date.getFullYear());
}

export function getNextBillingPeriod(value: string): string {
    return shiftBillingPeriod(value, 1);
}

export function getPreviousBillingPeriod(value: string): string {
    return shiftBillingPeriod(value, -1);
}

export function sortBillingPeriods(values: string[]): string[] {
    return [...values].sort(compareBillingPeriods);
}
