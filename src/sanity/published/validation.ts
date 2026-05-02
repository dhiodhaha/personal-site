import { PublishedContentError } from './errors';
import type {
  PortableTextBody,
  PublishedCategory,
  PublishedPost,
  PublishedProfile,
  PublishedProfileLink,
  PublishedWork,
  PublishedWorkStatus,
  SanityImage,
  SanityImageAsset,
} from './types';

type Context = {
  documentId?: string;
  documentType: string;
  fieldPath?: string;
};

const workStatuses = new Set<PublishedWorkStatus>(['live', 'ongoing', 'paused']);

function fail(context: Context, message: string): never {
  throw new PublishedContentError({
    documentId: context.documentId,
    documentType: context.documentType,
    fieldPath: context.fieldPath,
    message,
  });
}

function child(context: Context, fieldPath: string): Context {
  return {
    ...context,
    fieldPath: context.fieldPath ? `${context.fieldPath}.${fieldPath}` : fieldPath,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requiredRecord(value: unknown, context: Context): Record<string, unknown> {
  if (!isRecord(value)) {
    fail(context, 'Expected an object.');
  }

  return value;
}

function optionalString(value: unknown, context: Context): string | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (typeof value !== 'string') {
    fail(context, 'Expected a string.');
  }

  return value;
}

function requiredString(value: unknown, context: Context): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    fail(context, 'Expected a non-empty string.');
  }

  return value;
}

function requiredNumber(value: unknown, context: Context): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    fail(context, 'Expected a finite number.');
  }

  return value;
}

function optionalBoolean(value: unknown): boolean {
  return value === true;
}

function optionalStringArray(value: unknown, context: Context): string[] {
  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    fail(context, 'Expected an array of strings.');
  }

  return value;
}

function requiredStringArray(value: unknown, context: Context): string[] {
  const items = optionalStringArray(value, context);

  if (items.length === 0) {
    fail(context, 'Expected at least one string.');
  }

  return items;
}

function optionalArray(value: unknown, context: Context): unknown[] {
  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    fail(context, 'Expected an array.');
  }

  return value;
}

function requiredBody(value: unknown, context: Context): PortableTextBody {
  if (!Array.isArray(value) || value.length === 0) {
    fail(context, 'Expected at least one portable text block.');
  }

  return value;
}

function requiredUrl(value: unknown, context: Context): string {
  const url = requiredString(value, context);

  try {
    const parsed = new URL(url);

    if (!['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
      fail(context, 'Expected a URL with http, https, or mailto scheme.');
    }
  } catch {
    fail(context, 'Expected a valid URL.');
  }

  return url;
}

function optionalUrl(value: unknown, context: Context): string | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  return requiredUrl(value, context);
}

function validateImageAsset(value: unknown, context: Context): SanityImageAsset {
  const record = requiredRecord(value, context);

  return {
    _id: requiredString(record._id, child(context, '_id')),
    metadata: isRecord(record.metadata) ? (record.metadata as SanityImageAsset['metadata']) : undefined,
    mimeType: optionalString(record.mimeType, child(context, 'mimeType')),
    url: requiredUrl(record.url, child(context, 'url')),
  };
}

function validateImage(value: unknown, context: Context): SanityImage {
  const record = requiredRecord(value, context);

  return {
    alt: requiredString(record.alt, child(context, 'alt')),
    asset: validateImageAsset(record.asset, child(context, 'asset')),
    caption: optionalString(record.caption, child(context, 'caption')),
  };
}

function validateOptionalImage(value: unknown, context: Context): SanityImage | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  return validateImage(value, context);
}

export function validatePublishedCategory(value: unknown): PublishedCategory {
  const context = { documentType: 'category' };
  const record = requiredRecord(value, context);
  const documentId = requiredString(record._id, child(context, '_id'));
  const documentContext = { ...context, documentId };

  return {
    _id: documentId,
    description: optionalString(record.description, child(documentContext, 'description')),
    slug: requiredString(record.slug, child(documentContext, 'slug')),
    title: requiredString(record.title, child(documentContext, 'title')),
  };
}

export function validatePublishedWork(value: unknown): PublishedWork {
  const context = { documentType: 'work' };
  const record = requiredRecord(value, context);
  const documentId = requiredString(record._id, child(context, '_id'));
  const documentContext = { ...context, documentId };
  const status = requiredString(record.status, child(documentContext, 'status'));

  if (!workStatuses.has(status as PublishedWorkStatus)) {
    fail(child(documentContext, 'status'), 'Expected one of live, ongoing, or paused.');
  }

  return {
    _id: documentId,
    body: requiredBody(record.body, child(documentContext, 'body')),
    coverImage: validateImage(record.coverImage, child(documentContext, 'coverImage')),
    featured: optionalBoolean(record.featured),
    gallery: optionalArray(record.gallery, child(documentContext, 'gallery')).map((item, index) =>
      validateImage(item, child(documentContext, `gallery[${index}]`)),
    ),
    liveUrl: requiredUrl(record.liveUrl, child(documentContext, 'liveUrl')),
    proofTags: requiredStringArray(record.proofTags, child(documentContext, 'proofTags')),
    repoUrl: optionalUrl(record.repoUrl, child(documentContext, 'repoUrl')),
    role: requiredString(record.role, child(documentContext, 'role')),
    slug: requiredString(record.slug, child(documentContext, 'slug')),
    sortOrder: requiredNumber(record.sortOrder, child(documentContext, 'sortOrder')),
    stack: optionalStringArray(record.stack, child(documentContext, 'stack')),
    status: status as PublishedWorkStatus,
    summary: requiredString(record.summary, child(documentContext, 'summary')),
    title: requiredString(record.title, child(documentContext, 'title')),
  };
}

export function validatePublishedPost(value: unknown): PublishedPost {
  const context = { documentType: 'post' };
  const record = requiredRecord(value, context);
  const documentId = requiredString(record._id, child(context, '_id'));
  const documentContext = { ...context, documentId };

  return {
    _id: documentId,
    body: requiredBody(record.body, child(documentContext, 'body')),
    category: validatePublishedCategory(record.category),
    coverImage: validateOptionalImage(record.coverImage, child(documentContext, 'coverImage')),
    excerpt: requiredString(record.excerpt, child(documentContext, 'excerpt')),
    featured: optionalBoolean(record.featured),
    publishedAt: requiredString(record.publishedAt, child(documentContext, 'publishedAt')),
    relatedWork: optionalArray(record.relatedWork, child(documentContext, 'relatedWork')).map((item, index) => {
      const related = requiredRecord(item, child(documentContext, `relatedWork[${index}]`));

      return {
        _id: requiredString(related._id, child(documentContext, `relatedWork[${index}]._id`)),
        slug: requiredString(related.slug, child(documentContext, `relatedWork[${index}].slug`)),
        summary: requiredString(related.summary, child(documentContext, `relatedWork[${index}].summary`)),
        title: requiredString(related.title, child(documentContext, `relatedWork[${index}].title`)),
      };
    }),
    slug: requiredString(record.slug, child(documentContext, 'slug')),
    title: requiredString(record.title, child(documentContext, 'title')),
    updatedAt: optionalString(record.updatedAt, child(documentContext, 'updatedAt')),
  };
}

function validateProfileLink(value: unknown, context: Context): PublishedProfileLink {
  const record = requiredRecord(value, context);

  return {
    label: requiredString(record.label, child(context, 'label')),
    url: requiredUrl(record.url, child(context, 'url')),
  };
}

export function validatePublishedProfile(value: unknown): PublishedProfile {
  const context = { documentType: 'profile' };
  const record = requiredRecord(value, context);
  const documentId = requiredString(record._id, child(context, '_id'));
  const documentContext = { ...context, documentId };

  return {
    _id: documentId,
    bio: requiredString(record.bio, child(documentContext, 'bio')),
    email: optionalString(record.email, child(documentContext, 'email')),
    headline: requiredString(record.headline, child(documentContext, 'headline')),
    links: optionalArray(record.links, child(documentContext, 'links')).map((item, index) =>
      validateProfileLink(item, child(documentContext, `links[${index}]`)),
    ),
    name: requiredString(record.name, child(documentContext, 'name')),
  };
}
