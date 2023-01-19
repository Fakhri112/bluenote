import { db } from '../../src/config/firebaseadmin.config'

export default async function handler(req, res) {

    const DATA_TYPE = req.query.type
    const DATA_ID = req.query.dataId
    const USER_ID = req.body.uid

    const requestSingleData = async () => {

        const entries = await db.collection(DATA_TYPE).doc(DATA_ID).get();
        if (!entries.data()) return res.status(404).send('Not Found')
        const getData = { ...entries.data(), id: entries.id }
        if (getData.uid !== USER_ID) return res.status(401).send('Not Authorized')
        return res.json(getData)

    }

    if (req.method == 'POST') {
        return requestSingleData()
    }
    else {
        return res.send('<h1>404 - Not Found</h1>')
    }
}