import { db } from "./db";

export async function importModules() {
    db.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
}

export async function createTable() {
    db.query(`CREATE TABLE IF NOT EXISTS storage (
        id uuid DEFAULT uuid_generate_v4 (),
        title varchar(32),
        private boolean DEFAULT false,
        author varchar(32),
        content TEXT,
        created_at timestamp without time zone NOT NULL DEFAULT (current_timestamp AT TIME ZONE 'UTC')
    );`);
}

export async function getLast() {
    const res = await db.query(`SELECT * 
                FROM storage
                WHERE private = false
                ORDER BY created_at
                DESC LIMIT 10;`);

    return res.rows;
}

export async function createOne(
    title: string,
    author: string,
    content: string,
    priv: boolean
): Promise<false | string> {
    const res = await db.query(
        `INSERT INTO storage(title, author, content, private)
    VALUES ($1, $2, $3, $4) RETURNING id;`,
        [title, author, content, priv]
    );

    const id = res?.rows[0]?.id;

    if (id === undefined) return false;
    return id;
}

export async function findOne(id: string) {
    const res = await db.query(`SELECT * FROM storage WHERE id = $1;`, [id]);

    if (res.rowCount === 0) {
        return false;
    }

    return res.rows[0];
}
