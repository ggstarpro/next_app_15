"use client"
import React, { FormEvent, useOptimistic } from 'react'
import { Button } from "@/components/ui/button";
import { HeartIcon, MessageCircleIcon, Share2Icon, ClockIcon } from "./Icons";
import { likeAction } from '@/lib/actions';
import { useAuth } from '@clerk/nextjs';

type PostInteractionProps = {
  postId: string
  initialLikes: string[]
  commentNumber: number
}

interface LikeState {
  likeCount: number
  isLiked: boolean
}

const PostInteraction = ({postId, initialLikes, commentNumber}: PostInteractionProps) => {
  const { userId } = useAuth()
  // ↓↓↓　楽観的UI更新昔からあるやつ　↓↓↓
  // const [likeState, setLikeState] = useState({
  //   likeCount: initialLikes.length,
  //   isLiked: userId ? initialLikes.includes(userId) : false
  // })

  // const handleLikeSubmit = async (e: FormEvent) => {
  //   e.preventDefault()
  //   try {
  //     setLikeState((prev) => ({
  //       likeCount: prev.isLiked
  //         ? prev.likeCount - 1
  //         : prev.likeCount + 1,
  //       isLiked: !prev.isLiked
  //     }))
  //     await likeAction(postId)
  //   } catch (error) {
  //     setLikeState((prev) => ({
  //       likeCount: prev.isLiked
  //         ? prev.likeCount + 1
  //         : prev.likeCount - 1,
  //       isLiked: !prev.isLiked
  //     }))
  //   }
  // }
  // ↑↑↑　楽観的UI更新昔からあるやつ　↑↑↑
  const initialState = {
    likeCount: initialLikes.length,
    isLiked: userId ? initialLikes.includes(userId) : false
  }
  const [optimisticLike, addOptimisticLike] = useOptimistic<LikeState, void>(initialState, (currentState) => ({
    likeCount: currentState.isLiked
      ? currentState.likeCount - 1
      : currentState.likeCount + 1,
      isLiked: !currentState.isLiked
  }))
  const handleLikeSubmit = async (e: FormEvent) => {
    try {
      addOptimisticLike()
      await likeAction(postId)
    } catch (error) {
      // rollbackは自動
    }
  }
  return (
    <div className='flex items-center'>
      <form onSubmit={handleLikeSubmit}>
        <Button variant="ghost" size="icon">
          <HeartIcon
            className={`h-5 w-5  ${
              optimisticLike.isLiked
              ? 'text-destructive'
              : 'text-muted-foreground'
              }`} />
        </Button>
      </form>
      {/* <span className='-ml-1 text-destructive'>{initialLikes.length}</span> */}
      <span className={`-ml-1 text-destructive ${
        optimisticLike.isLiked
        ? 'text-destructive'
        : ''
      }`}>{optimisticLike.likeCount}</span>
      <Button variant="ghost" size="icon">
        <MessageCircleIcon className="h-5 w-5 text-muted-foreground" />
      </Button>
      <span>{commentNumber}</span>
      <Button variant="ghost" size="icon">
        <Share2Icon className="h-5 w-5 text-muted-foreground" />
      </Button>
    </div>
  )
}

export default PostInteraction