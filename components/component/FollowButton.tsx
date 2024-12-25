"use client"
import React, { useOptimistic } from 'react'
import { Button } from '../ui/button'
import { boolean } from 'zod'
import { followAction } from '@/lib/actions'

interface Props {
  isCurrentUser:boolean,
  isFollowing: boolean
  userId: string
}

const FollowButton = ({
  isCurrentUser, isFollowing, userId
} : Props) => {
  const [optimisticFollow, addOptimisticFollow] = useOptimistic<
  {
    isFollowing: boolean,
  },void>({
    isFollowing
  }, (currentState) => ({
    isFollowing: !currentState.isFollowing
  }))

  const getButtonContent = () => {
    if (isCurrentUser) {
      return 'プロフィール編集'
    }

    // if (isFollowing) {
    if (optimisticFollow.isFollowing) {
      return 'フォロー中'
    }

    return 'フォローする'
  }

  const getButtonVariant = () => {
    if (isCurrentUser) {
      return 'secondary'
    }

    if (optimisticFollow.isFollowing) {
    // if (isFollowing) {
      return 'outline'
    }

    return 'default'
  }

  const handleFollowAction = async () => {
    if (isCurrentUser) {
      return
    }
    try {
      addOptimisticFollow();
      await followAction(userId)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    // <form action={followAction.bind(null, userId)}>
    <form action={handleFollowAction}>
    <Button className="w-full" variant={getButtonVariant()}>
      {getButtonContent()}
    </Button>
    </form>
  )
}

export default FollowButton