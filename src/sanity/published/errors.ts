type PublishedContentErrorInput = {
  documentId?: string;
  documentType?: string;
  fieldPath?: string;
  message: string;
};

export class PublishedContentError extends Error {
  readonly documentId?: string;
  readonly documentType?: string;
  readonly fieldPath?: string;

  constructor({ documentId, documentType, fieldPath, message }: PublishedContentErrorInput) {
    const location = [
      documentType && `type=${documentType}`,
      documentId && `id=${documentId}`,
      fieldPath && `field=${fieldPath}`,
    ]
      .filter(Boolean)
      .join(' ');

    super(location ? `Invalid published Sanity content (${location}): ${message}` : message);
    this.name = 'PublishedContentError';
    this.documentId = documentId;
    this.documentType = documentType;
    this.fieldPath = fieldPath;
  }
}

export class PublishedContentConfigError extends Error {
  constructor(message: string) {
    super(`Published Sanity content is not configured: ${message}`);
    this.name = 'PublishedContentConfigError';
  }
}
