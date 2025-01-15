import { redirect } from 'next/navigation';

// Reddit OAuth configuration
const REDDIT_CLIENT_ID = process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID as string;
const REDDIT_REDIRECT_URI = process.env.NEXT_PUBLIC_REDDIT_REDIRECT_URI as string;
const OAUTH_STATE_KEY = 'reddit_oauth_state';
const OAUTH_SCOPE = 'identity edit read vote';

// Generate a random state string for CSRF protection
function generateState() {
  return Math.random().toString(36).substring(2, 15);
}

// Build the Reddit authorization URL
export function getAuthUrl() {
  const state = generateState();
  localStorage.setItem(OAUTH_STATE_KEY, state);
  
  const params = new URLSearchParams({
    client_id: REDDIT_CLIENT_ID,
    response_type: 'code',
    state: state,
    redirect_uri: REDDIT_REDIRECT_URI,
    duration: 'permanent',
    scope: OAUTH_SCOPE
  });

  return `https://www.reddit.com/api/v1/authorize?${params.toString()}`;
}

// Exchange the authorization code for tokens
export async function exchangeCode(code: string, state: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> {
  const savedState = localStorage.getItem(OAUTH_STATE_KEY);
  if (!savedState || savedState !== state) {
    throw new Error('Invalid state parameter');
  }

  const response = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${REDDIT_CLIENT_ID}:`)}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDDIT_REDIRECT_URI,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for token');
  }

  const data = await response.json();
  return data;
}

// Refresh the access token
export async function refreshToken(refresh_token: string): Promise<{
  access_token: string;
  expires_in: number;
}> {
  const response = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${REDDIT_CLIENT_ID}:`)}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  const data = await response.json();
  return data;
}

// Fetch the user's information
export async function fetchUserInfo(access_token: string): Promise<{
  name: string;
  id: string;
}> {
  const response = await fetch('https://oauth.reddit.com/api/v1/me', {
    headers: {
      'Authorization': `Bearer ${access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user info');
  }

  const data = await response.json();
  return {
    name: data.name,
    id: data.id,
  };
}