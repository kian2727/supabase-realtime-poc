'use client'

import { supabase } from "@/utils/supabase/client";
import RealtimePosts, { post } from "./realtime-posts";
import { useEffect, useState } from "react";

export default function RealtimePage() {
  const [posts, setPosts] = useState<post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getPosts = async () => {
      const { data } = await supabase.from('post').select('*');
      setPosts(data ?? []);
      setIsLoading(false);
    }
    getPosts();

  }, [supabase]);
  return isLoading ? <div>Loading...</div> : <RealtimePosts serverPosts={posts} />
}
