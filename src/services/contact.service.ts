import { findContactsByEmail, findContactsById, findContactsByLinkedId, findContactsByPhone, insertNewContact, insertSecondaryContact, uploadToSecondary } from "../db/contact.queries.js"
import { deleteDuplicateRows, extractPrimary, extractSummary } from "../utils/helper.js"

const getExistingContacts = async(phonenumber?: string, email?: string) => {
    let baseContacts: any[] = []
    if (phonenumber) baseContacts = baseContacts.concat(await findContactsByPhone(phonenumber))
    if (email) baseContacts = baseContacts.concat(await findContactsByEmail(email))
    baseContacts = deleteDuplicateRows(baseContacts)

    const contactsMap = new Map<number, any>()
    for (const contact of baseContacts) {
        contactsMap.set(contact.id, contact)
        if (contact.linkprecedence === "secondary" && contact.linkedid) {
            const primary = await findContactsById(contact.linkedid)
            if (primary) contactsMap.set(primary.id, primary)
            const siblings = await findContactsByLinkedId(contact.linkedid)
            for (const sib of siblings) contactsMap.set(sib.id, sib)
        }
        if (contact.linkprecedence === "primary") {
            const siblings = await findContactsByLinkedId(contact.id)
            for (const sib of siblings) contactsMap.set(sib.id, sib)
        }
    }
    return Array.from(contactsMap.values())
}

const normalizeContactHierarchy = async(contacts : any[], primaryId: number) =>{
    for (const contact of contacts){
        if(contact.id !==primaryId && contact.linkprecedence === "primary"){
            await uploadToSecondary(contact.id, primaryId)
        }
    }
}

const isNewEmailOrPhone = (contacts: any[], email?: string, phonenumber?: string) => {
    const emailIsNew = email && !contacts.some(c => c.email === email)
    const phoneIsNew = phonenumber && !contacts.some(c => c.phonenumber === phonenumber)
    return emailIsNew || phoneIsNew;
}

const createAndAppendSecondryIfNecessary = async(
    email?: string,
    phonenumber?: string,
    primaryId?: number
)=>{
    return await insertSecondaryContact(phonenumber, email, primaryId)
}


export const handleContactIdentification = async (phonenumber ?: string, email ?: string )=>{
    const allMatches = await getExistingContacts(phonenumber, email)

    if (allMatches.length===0){
        const newPrimary = await insertNewContact(phonenumber, email)
        return{
            "primaryContatctId": newPrimary.id,
			"emails": [newPrimary.email],
			"phonenumbers": [newPrimary.phonenumber],
			"secondaryContactIds": []
        }
    }

    const primary = extractPrimary(allMatches)

    await normalizeContactHierarchy( allMatches , primary.id)

    if(isNewEmailOrPhone(allMatches, email, phonenumber)){
        const newSecondary = await createAndAppendSecondryIfNecessary(email, phonenumber, primary.id)
        allMatches.push(newSecondary)
    }

    return extractSummary(allMatches, primary.id)

}