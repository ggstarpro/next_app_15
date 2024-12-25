"use server"

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { resolve } from "path";
import { z } from "zod";


/**
 * サーバーアクションの注意点
 * - サーバコンポーネント、クライアントコンポーネントの両方で使用可能
 * - クライアントコンポーネントでは別ファイルにしないと機能しない。
 * - アロー関数は使用しない、functionで書く。正常に動かなくなったことがあったらしい。
 */

type State = {
  error?: string | undefined
  success: boolean
}

// ServerActions
export async function addPostAction(formData: FormData) {
  // "use server"
  try {
    const { userId } = auth()
    if (!userId) {
      return {
        error: 'ユーザが存在しません',
        success: false,
      }
    }
    const postText = formData.get('post') as string;
    const postTextSchema = z
      .string()
      .min(1, 'ポスト内容を入力してください。')
      .max(140, '140字以内で入力してください。')
    const validatedPostText = postTextSchema.parse(postText)

    await new Promise(resolve => setTimeout(resolve, 3000))
    await prisma.post.create({
      data: {
        content: validatedPostText,
        authorId: userId,
      }
    })
    return {
      error: undefined,
      success: true,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: error.errors.map((e) => e.message).join(", "),
        success: false
      }
    } else if (error instanceof Error) {
      return {
        error: error.message,
        success: false
      }
    } else {
      return {
        error: "予期せぬエラーが発生しました。",
        success: false
      }
    }
  }
}

export async function addPostActionForUseStateForm(prevState: State, formData: FormData): Promise<State> {
  // "use server"
  try {
    const { userId } = auth()
    if (!userId) {
      return {
        error: 'ユーザが存在しません',
        success: false,
      }
    }
    const postText = formData.get('post') as string;
    const postTextSchema = z
      .string()
      .min(1, 'ポスト内容を入力してください。')
      .max(140, '140字以内で入力してください。')
    const validatedPostText = postTextSchema.parse(postText)

    await new Promise(resolve => setTimeout(resolve, 3000))
    await prisma.post.create({
      data: {
        content: validatedPostText,
        authorId: userId,
      }
    })
    revalidatePath("/")

    return {
      error: undefined,
      success: true,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: error.errors.map((e) => e.message).join(", "),
        success: false
      }
    } else if (error instanceof Error) {
      return {
        error: error.message,
        success: false
      }
    } else {
      return {
        error: "予期せぬエラーが発生しました。",
        success: false
      }
    }
  }
}

export const likeAction = async(postId: string) => {
  const { userId } = auth()
  if (!userId) {
    throw new Error("User is not authenticated")
  }

  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId,
      }
    })
    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        }
      })
      revalidatePath('/')
    } else {
      await prisma.like.create({
        data: {
          postId,
          userId,
        }
      })
      revalidatePath('/')
    }

  } catch (error) {
    console.log(error)
  }
}