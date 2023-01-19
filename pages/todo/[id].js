import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import TodoComponent from "../../components/main-editor/TodoComponent";
import { useDataContext } from "../../src/hook/StateContext";

const axios = require('axios');


const PostPage = () => {
    const router = useRouter()
    const id = router.query.id

    const { userData } = useDataContext()
    const [data, SetData] = useState()

    const fetchData = async () => {
        if (userData && id) {
            const responseNotes = await axios.post(`/api/getdata?type=todos&dataId=${id}`, { uid: userData.user.uid })
            return SetData(responseNotes.data)
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
            <TodoComponent
                color={data.color}
                content={data.content}
                title={data.title}
                todoID={data.id}
                date_modified={data.date_modified}
                date_created={data.date_created}
            />
        }
    </div>;
}

export default PostPage