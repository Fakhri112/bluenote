import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import NoteComponent from "../../components/main-editor/NoteComponent";
import TodoComponent from "../../components/main-editor/TodoComponent";
import { useDataContext } from "../../src/hook/StateContext";

const axios = require('axios');


const PostPage = () => {
    const router = useRouter()
    const id = router.query.id

    const { userData, SetDataContext } = useDataContext()
    const [data, SetData] = useState()

    const fetchData = async () => {
        if (userData && id) {
            try {
                const responseNotes = await axios.post(`/api/getdata?type=trashes&dataId=${id}`,
                    { uid: userData.user.uid })
                return SetData(responseNotes.data)
            } catch (error) {
                router.push('/404')
            }
        }
    }

    useEffect(() => {
        if (!(JSON.parse(localStorage.getItem("logged_user")))) router.push("/")
    }, [])

    useEffect(() => {
        fetchData()
    }, [userData, id])

    return <div>

        {(!data) ? null :

            (data.type == 'note') ?
                <NoteComponent
                    color={data.color}
                    content={data.content}
                    title={data.title}
                    date_modified={data.date_modified}
                    date_created={data.date_created}
                    noteID={data.id}
                    isTrash={true}
                />
                :
                <TodoComponent
                    color={data.color}
                    content={data.content}
                    title={data.title}
                    date_modified={data.date_modified}
                    date_created={data.date_created}
                    todoID={data.id}
                    isTrash={true}
                />
        }
    </div>;
}

export default PostPage