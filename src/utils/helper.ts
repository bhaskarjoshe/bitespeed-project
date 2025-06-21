export const deleteDuplicateRows = (contacts: any[])=>{
    return Array.from(new Map(contacts.map(c=>[c.id,c])).values())
}

export const extractPrimary = (contacts: any[])=>{
    return contacts
    .sort((a, b) => new Date(a.createdat).getTime() - new Date(b.createdat).getTime())
    .find(c => c.linkprecedence === 'primary') || contacts[0]
}

export const extractSummary = (contacts: any[], primaryId: Number)=>{
    const primary = contacts.find(c=>c.id===primaryId)
    const emails = new Set<string[]>()
    const phones = new Set<string[]>()
    const secondarIds: number[] =[]

    for (const contact of contacts){
        if (contact.email) emails.add(contact.email)
        if (contact.phonenumber) phones.add(contact.phonenumber)
        if (contact.id !== primaryId) secondarIds.push(contact.id)
    }

    return{
        "primaryContatctId": primaryId,
        "emails": [primary.email, ...Array.from(emails).filter(e=>e!==primary.email)],
        "phonenumbers": [primary.phonenumber, ...Array.from(phones).filter(p=>p!==primary.phonenumber)],
        "secondaryContactIds": secondarIds
    }
}
