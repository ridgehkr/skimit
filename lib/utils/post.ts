import type { RedditPost } from '@/types/reddit'

export type PostType = 'gallery' | 'video' | 'image' | 'text' | 'link'

export function getPostType(post: RedditPost): PostType {
  if (post.is_gallery) return 'gallery'
  if (post.is_video) return 'video'
  if (post.url.match(/\.(jpg|jpeg|png|gif)$/i)) return 'image'
  if (post.selftext) return 'text'
  return 'link'
}

export function getThumbnail(post: RedditPost): string | null {
  if (post.preview?.images[0]?.resolutions) {
    const resolutions = post.preview.images[0].resolutions
    const image = resolutions[Math.min(2, resolutions.length - 1)]
    if (image?.url) return image.url.replace(/&amp;/g, '&')
  }

  if (post.is_gallery && post.gallery_data?.items[0]?.media_id) {
    const mediaId = post.gallery_data.items[0].media_id
    const mediaItem = post.media_metadata?.[mediaId]
    if (mediaItem && 'p' in mediaItem && Array.isArray(mediaItem.p)) {
      const preview = mediaItem.p[Math.min(2, mediaItem.p.length - 1)]
      if (preview?.u) return preview.u.replace(/&amp;/g, '&')
    }
  }

  if (post.url.match(/\.(jpg|jpeg|png|gif)$/i)) return post.url

  return null
}

export function getGalleryImages(post: RedditPost): string[] {
  if (!post.is_gallery || !post.gallery_data || !post.media_metadata) return []

  return post.gallery_data.items
    .map((item) => {
      const metadata = post.media_metadata?.[item.media_id]
      if (!metadata || metadata.status !== 'valid') return null
      const imageUrl = metadata.s?.u ?? metadata.p?.[metadata.p.length - 1]?.u
      return imageUrl ? imageUrl.replace(/&amp;/g, '&') : null
    })
    .filter((url): url is string => url !== null)
}
