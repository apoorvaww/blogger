import React from "react";
import { useState } from "react";
import axios from 'axios';

const Comment = () => {
    const [comment, setComment] = useState('');
    const blogId = useParams();

    const handleSubmit = async() => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/create-comment/${blogId}`)
        } catch (error) {
            
        }
    }

    return(
        <div>Comment</div>
    )
}

export default Comment;