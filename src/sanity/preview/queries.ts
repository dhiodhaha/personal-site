import { postProjection, workProjection } from '../published/queries';

export const previewWorkBySlugQuery = `*[
  _type == "work" &&
  slug.current == $slug
][0] ${workProjection}`;

export const previewPostBySlugQuery = `*[
  _type == "post" &&
  slug.current == $slug
][0] ${postProjection}`;
