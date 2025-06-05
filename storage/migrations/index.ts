import m1 from '@/storage/migrations/V1__car'
import m2 from '@/storage/migrations/V2__location'
import m3 from '@/storage/migrations/V3__parked'


export interface Migration {
    id: number,
    description?: string,
    sql: string,
}


export const migrations: Migration[] = [m1, m2, m3]