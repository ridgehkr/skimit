import PostPageClient from './post-page-client'

interface PostPageProps {
  params: { subreddit: string; postId: string }
}

export default function PostPage({ params }: PostPageProps) {
  return <PostPageClient params={params} />
}
