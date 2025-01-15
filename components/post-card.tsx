"use client";

import { RedditPost } from "@/types/reddit";
import { formatRedditDate } from "@/lib/utils/reddit-date";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  MessageCircle,
  Image as ImageIcon,
  Link as LinkIcon,
  Video as VideoIcon,
  FileText,
  Images,
} from "lucide-react";
import { useRedditAuth } from "@/lib/auth/reddit-auth";

interface PostCardProps {
  post: RedditPost;
  onClick: () => void;
}

function getPostType(post: RedditPost) {
  if (post.is_gallery) {
    return { icon: Images, label: "Gallery" };
  }
  if (post.is_video) {
    return { icon: VideoIcon, label: "Video" };
  }
  if (post.url.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return { icon: ImageIcon, label: "Image" };
  }
  if (post.selftext) {
    return { icon: FileText, label: "Text" };
  }
  return { icon: LinkIcon, label: "Link" };
}

export function PostCard({ post, onClick }: PostCardProps) {
  const { isAuthenticated } = useRedditAuth();
  const { icon: TypeIcon, label: typeLabel } = getPostType(post);
  const isImage = post.url.match(/\.(jpg|jpeg|png|gif)$/i);

  // For gallery posts, try to get the first image
  const galleryFirstImage = post.is_gallery && post.gallery_data?.items[0]?.media_id && post.media_metadata?.[post.gallery_data.items[0].media_id];
  const galleryThumbnail = galleryFirstImage?.p?.[0]?.u?.replace(/&amp;/g, '&');

  return (
    <Card 
      className="hover:bg-accent/50 transition-colors cursor-pointer" 
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex gap-3">
          {isAuthenticated && (
            <div className="flex flex-col items-center gap-0.5">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowUpIcon className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">{post.score}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowDownIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
          {(isImage || galleryThumbnail) && (
            <div className="flex-shrink-0">
              <img 
                src={galleryThumbnail || post.url}
                alt={post.title}
                className="w-[80px] h-[80px] object-cover rounded-md"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold mb-1 truncate">
              {post.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <TypeIcon className="h-3.5 w-3.5" />
                <span>{typeLabel}</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <span>Posted by u/{post.author}</span>
              <span className="text-muted-foreground">•</span>
              <span>{formatRedditDate(post.created_utc)}</span>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" />
                {post.num_comments} comments
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}