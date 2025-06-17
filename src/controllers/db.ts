import { Request,Response } from "express";
import { pool } from "../config/db";

export const db = async (req: Request, res:Response)=>{
    try{
        const result = await pool.query('SELECT * from Contact')
        console.log(result)
        res.json(result.rows[0])
    }
    catch(error){
        console.log("DB Error", error)
        res.status(500).send("Database Error")
    }
}