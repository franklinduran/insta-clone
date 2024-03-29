import React, { useState, useEffect } from 'react'
import { SearchIcon, PlusCircleIcon, UserGroupIcon, HeartIcon, PaperAirplaneIcon,DotsHorizontalIcon, MenuIcon, ChatIcon, BookmarkIcon, EmojiHappyIcon } from "@heroicons/react/outline"

import { HeartIcon as HeartIconFilled } from '@heroicons/react/solid'
import { useSession } from 'next-auth/react'
import { addDoc, serverTimestamp, collection, query, onSnapshot, orderBy, setDoc, doc, deleteDoc } from '@firebase/firestore'
import { db } from '../firebase'
import Moment from 'react-moment'


function Post({ id, username, userImg, img, caption }) {

    const { data: session } = useSession()
    const [ comment, setComment ] = useState("")
    const [ comments, setComments ] = useState([])
    const [ likes, setLikes ] = useState([])
    const [ hasLiked, setHasLiked ] = useState(false)

    useEffect(
        () => onSnapshot(
            query(
                collection(db, 'posts', id, 'comments'), 
                orderBy('timestamp', 'desc')
            ), 
            (snapshot) => setComments(snapshot.docs)
        ), [db, id]
    )

    useEffect(() => onSnapshot(
        collection(db, 'posts', id, 'likes'),(snapshot) =>
            setLikes(snapshot.docs)
        )
    , [db, id])

    useEffect(
        () => 
            setHasLiked(
                likes.findIndex((like) => like.id === session?.user?.email) !== -1
            ),
    [likes])

    const likePost = async () => {
        await setDoc(doc(db, 'posts', id, 'likes', session.user.email), {
            username: session.user.email,
        })
        if (hasLiked) {
            await deleteDoc(doc(db, 'posts', id, 'likes', session.user.email))
        } else {
            await setDoc(doc(db, 'posts', id, 'likes', session.user.email), {
                username: session.user.email,
            })
        }
    }

    const sendComment = async (e) => {
        e.preventDefault()
        const commentToSend = comment;
        setComment('')

        await addDoc(collection(db, 'posts', id, 'comments'), {
            comment: commentToSend,
            username: session.user.email,
            userImage: session.user.image,
            timestamp: serverTimestamp()
        })
    }

    return (
        <div className="bg-white my-7 border rounded-sm">

            {/* Header */}

            <div className="flex items-center p-5">
                <img className="rounded-full h-12 w-12 object-contain border p-1 mr-3" src={userImg} alt="" />
                <p className="flex-1 font-bold">{username}</p>
                <DotsHorizontalIcon className="h-5"/>
            </div>

            {/* img */}

            <img src={img} className="object-cover w-full" />

            {/* Button */}

            {session && (
                <div className="flex justify-between px-4 pt-4">
                    <div className="flex space-x-4">
                        {
                            hasLiked ? (
                                <HeartIconFilled onClick={likePost} className="btn text-red-500"/>
                            ) : (
                                <HeartIcon onClick={likePost} className="btn"/>
                            )
                        }
                        <ChatIcon className="btn"/>
                        <PaperAirplaneIcon className="btn rotate-45" />
                    </div>
                    <BookmarkIcon className="btn" />
                </div>
            )}

            {/* caption */}

            <p className='p-5 truncate'>
                {likes.length > 0 && (
                    <p className='font-bold mb-1'>{likes.length} likes</p>
                )}
                <span className="font-bold mr-1">{username}</span>
                {caption}
            </p>

            {/* comment */}

            {comments.length > 0 && (
                <div className='ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin'>
                    {comments.map((comment) => (
                        <div key={comment.id} className='flex items-center space-x-2 mb-3'>
                            <img 
                                className="h-7 rounded-full" 
                                src={comment.data().userImage} 
                                alt=""
                            />
                            <p className='text-sm flex-1'>
                                <span className='font-bold'>{comment.data().username}</span>{" "}
                                {comment.data().comment}
                            </p>

                            <Moment fromNow className="pr-5 text-xs">
                                {comment.data().timestamp?.toDate()}
                            </Moment>
                        </div>
                    ))}
                </div>
            )}
            
            {/* input box */}

            {session && (
                <form className="flex items-center p-4">
                    <EmojiHappyIcon className="h-7" />
                    <input 
                        type="text" 
                        value={comment}
                        onChange={ e => setComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="border-none flex-1 focus:ring-0 outline-none" 
                    />
                    <button 
                        type='submit' 
                        disabled={!comment.trim()} 
                        className="text-blue-400"
                        onClick={ sendComment }>
                            Post
                    </button>
                </form>
            )}

        </div>
    )
}

export default Post
