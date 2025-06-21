import { pool } from "../config/db.js";


export const findContactsById = async (id: number) => {
    const res = await pool.query(`SELECT * FROM contact WHERE id=$1`, [id])
    return res.rows[0]
}

export const findContactsByLinkedId = async (linkedId: number) => {
    const res = await pool.query(`SELECT * FROM contact WHERE linkedid=$1`, [linkedId])
    return res.rows
}

export const findContactsByPhone = async(phonenumber : string)=>{
    const res = await pool.query(`SELECT * FROM contact WHERE phonenumber=$1`, [phonenumber])
    const primary = res.rows.find(row => row.linkprecedence === 'primary')

    if (primary){
        const linked = await pool.query(`SELECT * FROM contact WHERE linkedid=$1`, [primary.id])
        return [...res.rows, ...linked.rows]
    }

    return res.rows
}

export const findContactsByEmail = async(email: string)=>{
    const res = await pool.query(`SELECT * FROM contact WHERE email=$1`, [email])
    return res.rows
}

export const insertNewContact = async(phonenumber?: string, email?:string)=>{
    const res = await pool.query(
        `
        INSERT INTO Contact (phonenumber, email, linkprecedence, createdat, updatedat)
        VALUES ($1, $2, 'primary', now(), now())
        RETURNING *
        `, [phonenumber || null, email|| null]
    )
    return res.rows[0]
}

export const uploadToSecondary = async(id: number, linkedId: number)=>{
    await pool.query(
        `UPDATE Contact SET linkprecedence='secondary', linkedid=$1, updatedat=now() WHERE id=$2`,
        [linkedId, id]
    )
}

export const insertSecondaryContact = async (phonenumber?: string, email?: string, linkedId?: number)=>{
    const res = await pool.query(
        `INSERT INTO Contact (phonenumber, email, linkprecedence, linkedid, createdat, updatedat)
        VALUES ($1, $2, 'secondary', $3, now(), now())
        RETURNING *`,
        [phonenumber || null, email || null, linkedId]
    )
    return res.rows[0]
}