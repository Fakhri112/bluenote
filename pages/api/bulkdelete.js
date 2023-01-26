import { db } from '../../src/config/firebaseadmin.config'

export default async function handler(req, res) {

    const TRASH_DATA = req.body

    const bulkDelete = async () => {

        try {
            let arrayTrash = JSON.parse(TRASH_DATA.all_trash)
            console.log(arrayTrash.length)
            if (TRASH_DATA.current_uid !== arrayTrash[0].uid) {
                return res.status(401).send('Not Authorized')
            }

            for (let index = 0; index < arrayTrash.length; index++) {
                console.log(index)
                if (index == arrayTrash.length) {
                    break
                }
                await db.collection('trashes').doc(arrayTrash[index].id).delete()
            }
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

    }

    if (req.method == 'DELETE') {
        return bulkDelete()
    }
    else {
        return res.send('<h1>404 - Not Found</h1>')
    }
}