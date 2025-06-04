export class StorageUtil {
    private constructor() {};

    public static formatDateForSQLite(date?: Date): string | undefined {
        if (!date) {
            return undefined;
        }

        //better way would be storing timezone in db but this works!
        const timezoneOffset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - timezoneOffset * 60 * 1000);

        return localDate.toISOString().replace('T', ' ').substring(0, 19); // 'YYYY-MM-DD HH:MM:SS'
    }

    public static parseSQLiteDate(dateString?: string): Date | undefined {
        if (!dateString) {
            return undefined;
        }

        const [datePart, timePart] = dateString.split(' ');
        if (!datePart || !timePart) {
            return undefined;
        }

        const [year, month, day] = datePart.split('-').map(Number);
        const [hour, minute, second] = timePart.split(':').map(Number);

        // Month is 0-based in JS Date constructor
        const date = new Date(year, month - 1, day, hour, minute, second);

        return isNaN(date.getTime()) ? undefined : date;
    }
}
