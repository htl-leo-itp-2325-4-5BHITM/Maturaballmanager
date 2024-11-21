import {Injectable} from '@angular/core';
import {openDB} from "idb";

@Injectable({
    providedIn: 'root'
})
export class AuthStore {
    private dbPromise = openDB('maturaballmanager', 1, {
        upgrade(db) {
            db.createObjectStore('auth');
        },
    });

    async set(key: string, value: any): Promise<void> {
        const db = await this.dbPromise;
        await db.put('auth', value, key);
    }

    async get(key: string): Promise<any> {
        const db = await this.dbPromise;
        return await db.get('auth', key);
    }

    async delete(key: string): Promise<void> {
        const db = await this.dbPromise;
        await db.delete('auth', key);
    }
}