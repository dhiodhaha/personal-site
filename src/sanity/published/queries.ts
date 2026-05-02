export const imageProjection = `{
  alt,
  caption,
  asset->{
    _id,
    url,
    mimeType,
    metadata {
      dimensions {
        width,
        height
      }
    }
  }
}`;

export const categoryProjection = `{
  _id,
  title,
  "slug": slug.current,
  description
}`;

export const workCardProjection = `{
  _id,
  title,
  "slug": slug.current,
  summary,
  status,
  role,
  proofTags,
  stack,
  coverImage ${imageProjection},
  liveUrl,
  repoUrl,
  featured,
  sortOrder
}`;

export const workProjection = `{
  _id,
  title,
  "slug": slug.current,
  summary,
  status,
  role,
  proofTags,
  stack,
  coverImage ${imageProjection},
  gallery[] ${imageProjection},
  liveUrl,
  repoUrl,
  body,
  featured,
  sortOrder
}`;

export const postCardProjection = `{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  category->${categoryProjection},
  publishedAt,
  updatedAt,
  coverImage ${imageProjection},
  featured
}`;

export const postProjection = `{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  category->${categoryProjection},
  publishedAt,
  updatedAt,
  coverImage ${imageProjection},
  body,
  relatedWork[]->{
    _id,
    title,
    "slug": slug.current,
    summary
  },
  featured
}`;

export const profileProjection = `{
  _id,
  name,
  headline,
  bio,
  email,
  links[] {
    label,
    url
  }
}`;

export const publishedWorkListQuery = `*[
  _type == "work" &&
  defined(slug.current) &&
  !(_id in path("drafts.**"))
] | order(sortOrder asc, title asc) ${workProjection}`;

export const publishedWorkBySlugQuery = `*[
  _type == "work" &&
  slug.current == $slug &&
  !(_id in path("drafts.**"))
][0] ${workProjection}`;

export const publishedWorkSlugsQuery = `*[
  _type == "work" &&
  defined(slug.current) &&
  !(_id in path("drafts.**"))
] | order(slug.current asc) {
  "slug": slug.current
}`;

export const publishedPostListQuery = `*[
  _type == "post" &&
  defined(slug.current) &&
  defined(publishedAt) &&
  publishedAt <= now() &&
  !(_id in path("drafts.**"))
] | order(publishedAt desc, title asc) ${postProjection}`;

export const publishedPostBySlugQuery = `*[
  _type == "post" &&
  slug.current == $slug &&
  defined(publishedAt) &&
  publishedAt <= now() &&
  !(_id in path("drafts.**"))
][0] ${postProjection}`;

export const publishedPostSlugsQuery = `*[
  _type == "post" &&
  defined(slug.current) &&
  defined(publishedAt) &&
  publishedAt <= now() &&
  !(_id in path("drafts.**"))
] | order(slug.current asc) {
  "slug": slug.current
}`;

export const publishedProfileQuery = `*[
  _type == "profile" &&
  !(_id in path("drafts.**"))
] | order(_updatedAt desc)[0] ${profileProjection}`;
