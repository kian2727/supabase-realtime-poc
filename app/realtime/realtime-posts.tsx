
'use client'

import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
export type post = {
  id: string;
  created_at: string;
  title: string;
}

export default function RealtimePosts({
  serverPosts
}: {
  serverPosts: post[];
}) {
  const [posts, setPosts] = useState<post[]>(serverPosts);
  useEffect(() => {
    const channel = supabase.channel('post').on('postgres_changes', { event: '*', schema: 'public', table: 'post' }, (payload) => {

      setPosts((prevPosts) => {
        const newPost = payload.new as post;
        const index = prevPosts.findIndex((p) => p.id === newPost.id);
        if (index !== -1) {
          const updatedPosts = [...prevPosts];
          updatedPosts[index] = newPost;
          return updatedPosts;
        } else {
          return [...prevPosts, newPost];
        }
      });

    }).subscribe();

    return () => {
      supabase.removeChannel(channel);
    }

  }, [supabase, posts, setPosts]);
  return <pre>{JSON.stringify(posts, null, 2)}</pre>;
}