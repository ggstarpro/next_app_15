// components/PostForm.tsx
"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

import { useRef, useState } from "react";
import { addPostAction, addPostActionForUseStateForm } from "@/lib/actions";
import SubmitButton from "./SubmitBUtton";
import { useFormState } from "react-dom";

export default function PostForm() {
  const initialState = {
    error: undefined,
    success: false
  }
  /**
   * useFormState(useActionState)
   */
  const [state, formAction] = useFormState(addPostActionForUseStateForm,  initialState)
  const [error, setError] = useState<string|undefined>("")
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (formData: FormData) => {
    const result = await addPostAction(formData)
    if (!result?.success) {
      setError(result?.error)
    } else {
      setError("")
      if (formRef.current) {
        formRef.current.reset()
      }
    }
  }

  if (state.success && formRef.current) {
    formRef.current.reset()
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src="/placeholder-user.jpg" />
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>
        {/* <form ref={formRef} action={handleSubmit} className="flex items-center flex-1"> */}
        <form ref={formRef} action={formAction} className="flex items-center flex-1">
          <Input
            type="text"
            placeholder="What's on your mind?"
            className="flex-1 rounded-full bg-muted px-4 py-2"
            name="post"
          />
          {/* <Button variant="ghost" size="icon">
            <SendIcon className="h-5 w-5 text-muted-foreground" />
            <span className="sr-only">Tweet</span>
          </Button> */}
          <SubmitButton />
        </form>
      </div>
      {/* {error && (
        <p className="text-destructive mt-1 ml-14 flex-1">{"1>" + error}</p>
      )} */}
      {state.error && (
        <p className="text-destructive mt-1 ml-14 flex-1">{"2>" + state.error}</p>
      )}
    </div>
  );
}
