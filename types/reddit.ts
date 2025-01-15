export interface RedditPost {
  id: string;
  title: string;
  author: string;
  score: number;
  num_comments: number;
  url: string;
  permalink: string;
  created_utc: number;
  subreddit: string;
  selftext?: string;
  is_video: boolean;
  is_gallery?: boolean;
  gallery_data?: {
    items: Array<{
      media_id: string;
      id: number;
    }>;
  };
  media_metadata?: {
    [key: string]: {
      status: string;
      e: string;
      m: string;
      p: Array<{
        y: number;
        x: number;
        u: string;
      }>;
      s: {
        y: number;
        x: number;
        u: string;
      };
    };
  };
  media?: {
    reddit_video?: {
      fallback_url: string;
    };
  };
}

export interface RedditComment {
  id: string;
  author: string;
  body: string;
  score: number;
  created_utc: number;
  replies?: {
    data: {
      children: Array<{
        data: RedditComment;
      }>;
    };
  };
}

export interface SubredditInfo {
  display_name: string;
  title: string;
  public_description: string;
  subscribers: number;
  active_user_count: number;
  created_utc: number;
  over18: boolean;
  description: string;
  header_img?: string;
  icon_img?: string;
  banner_background_image?: string;
}

export type SortBy = 'hot' | 'new' | 'top'
export type CommentSortBy = 'best' | 'top' | 'new' | 'controversial' | 'old'