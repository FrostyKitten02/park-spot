export class StorageUtil {
    private constructor() {};

    public static formatDateForSQLite(date?: Date): string | null {
        if (!date) return null;
        return date.toISOString().replace('T', ' ').substring(0, 19); // 'YYYY-MM-DD HH:MM:SS'
    }
}
