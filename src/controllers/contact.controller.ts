import { Request,Response, RequestHandler } from "express";
import { handleContactIdentification } from "../services/contact.service.js";


export const identifyContact:RequestHandler = async (req: Request, res: Response):Promise<void> =>{
    const {email, phoneNumber} = req.body
    if (!phoneNumber && !email){
        res.status(400).json({error: "Either phone number or email must be provided."})
        return
    }
    try {
        const contact = await handleContactIdentification(phoneNumber, email)
        res.status(200).json({contact})
    }
    catch(error){
        console.log("Error identifying contact: ", error)
        res.status(500).json({error: "Server error."})
    }
}