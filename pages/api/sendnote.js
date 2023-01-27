import { db } from '../../src/config/firebaseadmin.config'

export default async function handler(req, res) {

    const USER_DATA = req.body
    const DATA_TYPE = req.query.type
    const DATA_ID = req.query.id


    switch (req.method) {
        case 'POST':
            try {
                const sendingData = await db.collection(DATA_TYPE).add(USER_DATA);
                return res.json({
                    status: 200,
                    id: sendingData._path.segments[1],
                    msg: 'Success'
                })
            } catch (error) {
                return res.json({
                    status: 500,
                    msg: 'Internal Server Error'
                })
            }
        case 'PUT':
            try {
                await db.collection(DATA_TYPE).doc(DATA_ID).set(USER_DATA);
                return res.json({
                    status: 200,
                    msg: 'Success'
                })
            } catch (error) {
                return res.json({
                    status: 500,
                    msg: 'Internal Server Error'
                })
            }
        case 'DELETE':
            try {
                await db.collection(DATA_TYPE).doc(USER_DATA.id).delete()
                return res.json({
                    status: 200,
                    msg: 'Success'
                })
            } catch (error) {
                return res.json({
                    status: 500,
                    msg: 'Internal Server Error'
                })
            }
        default:
            return res.send('<h1>404 - Not Found</h1>')
    }
}