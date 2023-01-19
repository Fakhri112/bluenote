import { db } from '../../src/config/firebaseadmin.config'

export default async function handler(req, res) {
    const requestNotes = async (type) => {
        const entries = await db.collection(type).where("uid", "==", req.body.uid).get();
        const getData = entries.docs.map((data) => {
            return {
                ...data.data(), id: data.id
            }
        })
        return res.json(getData)
    }

    if (req.method === 'POST') {
        return requestNotes(req.query.type)
    } else {
        return req.status(404)
    }
}