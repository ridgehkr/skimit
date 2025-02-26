const REDDIT_API_BASE = 'https://oauth.reddit.com'

export async function redditApiRequest(
  endpoint: string,
  accessToken: string,
  options: RequestInit = {}
) {
  const response = await fetch(`${REDDIT_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Reddit API error: ${response.status}`)
  }

  return response.json()
}

// export async function voteOnPost(
//   id: string,
//   direction: 1 | 0 | -1,
//   accessToken: string
// ) {
//   return redditApiRequest('/api/vote', accessToken, {
//     method: 'POST',
//     body: JSON.stringify({
//       dir: direction,
//       id: `t3_${id}`,
//     }),
//   });
// }

// export async function addComment(
//   parentId: string,
//   text: string,
//   accessToken: string
// ) {
//   return redditApiRequest('/api/comment', accessToken, {
//     method: 'POST',
//     body: JSON.stringify({
//       parent: `t3_${parentId}`,
//       text: text,
//     }),
//   });
// }
