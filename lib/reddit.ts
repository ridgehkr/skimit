const REDDIT_API_BASE = 'https://www.reddit.com';

interface RedditApiResponse {
  data: {
    children: Array<{
      data: any;
    }>;
    after?: string | null;
  };
}

async function handleRedditResponse(response: Response) {
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Subreddit not found');
    }
    throw new Error(`Reddit API error: ${response.status}`);
  }
  return response.json();
}

export async function fetchRedditPosts(
  subreddit: string,
  sort: string = 'hot',
  after?: string | null
): Promise<{ posts: any[], after: string | null }> {
  const params = new URLSearchParams({
    raw_json: '1',
    ...(after ? { after } : {}),
  });

  const response = await fetch(
    `${REDDIT_API_BASE}/r/${subreddit}/${sort}.json?${params}`,
    { cache: 'no-store' }
  );

  const data: RedditApiResponse = await handleRedditResponse(response);
  return {
    posts: data.data.children.map(child => child.data),
    after: data.data.after || null,
  };
}

export async function fetchRedditPost(id: string) {
  const response = await fetch(
    `${REDDIT_API_BASE}/comments/${id}.json?raw_json=1`,
    { cache: 'no-store' }
  );

  const data = await handleRedditResponse(response);
  if (!data?.[0]?.data?.children?.[0]?.data) {
    return null;
  }

  return data[0].data.children[0].data;
}

export async function fetchComments(postId: string, sort: string = 'best') {
  const response = await fetch(
    `${REDDIT_API_BASE}/comments/${postId}.json?sort=${sort}&raw_json=1`,
    { cache: 'no-store' }
  );

  const data = await handleRedditResponse(response);
  if (!data?.[1]?.data?.children) {
    return [];
  }

  return data[1].data.children
    .filter((child: any) => child.kind === 't1')
    .map((child: any) => child.data);
}

export async function fetchSubredditInfo(subreddit: string): Promise<SubredditInfo | null> {
  try {
    if (!subreddit?.trim()) {
      throw new Error('Subreddit name is required');
    }

    // Special cases that don't have about pages
    if (subreddit.toLowerCase() === 'all' || subreddit.toLowerCase() === 'popular') {
      return {
        display_name: subreddit,
        title: subreddit === 'all' ? 'All Subreddits' : 'Popular Posts',
        public_description: subreddit === 'all' 
          ? 'Posts from all of Reddit' 
          : 'The most popular posts on Reddit',
        subscribers: 0,
        active_user_count: 0,
        created_utc: 0,
        over18: false,
        description: '',
      };
    }

    const cleanSubreddit = subreddit.trim().toLowerCase();
    const response = await fetch(
      `${REDDIT_API_BASE}/r/${cleanSubreddit}/about.json`,
      { 
        cache: 'no-store',
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    const data = await handleRedditResponse(response);
    return data.data;
  } catch (error) {
    console.error(`Error fetching info for r/${subreddit}:`, error);
    throw error instanceof Error ? error : new Error('Failed to load subreddit info');
  }
}