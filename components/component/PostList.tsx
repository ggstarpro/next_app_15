// components/PostList.tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HeartIcon, MessageCircleIcon, Share2Icon, ClockIcon } from "./Icons";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { fetchPosts } from "@/lib/postDataFetcher";
import Post from "@/components/component/Post";

export default async function PostList({username}: {username?: string}) {
  // const posts = [
  //   {
  //     id: 1,
  //     author: { name: "Jane Doe", username: "@janedoe" },
  //     content:
  //       "Excited to share my latest project with you all! Check it out and let me know what you think.",
  //     timestamp: "2h",
  //     comments: [
  //       { author: "John Doe", content: "Great work!" },
  //       { author: "Jane Doe", content: "Looks amazing!" },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     author: { name: "John Smith", username: "@johnsmith" },
  //     content:
  //       "Enjoying the beautiful weather today! Whos up for a hike later?",
  //     timestamp: "1h",
  //   },
  // ];

  const { userId } = auth()

  if (!userId) {
    return;
  }
  const posts = await fetchPosts(userId, username)
  // api/posts/route.tsを作成して下記のようにすることもできるが、、、
  // APIを公開しない場合は下記のようにする必要はない。
  // const posts = await fetch("htttp://localhost:3000/api/posts")

  return (
    <div className="space-y-4">
      {posts ? posts.map((post) => (
        <Post key={post.id} post={post} />
      )): <div>ポストが見つかりません</div>}
    </div>
  );
}
