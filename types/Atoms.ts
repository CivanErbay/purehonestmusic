export interface Media extends BasicMedia {
  alt: string;
  createdAt: string;
  focalX?: number;
  focalY?: number;
  id: string;
  prefix: string;
  updatedAt: string;
  sizes?: {
    thumbnail?: BasicMedia;
    medium?: BasicMedia;
    large?: BasicMedia;
    xl?: BasicMedia;
  };

  isCover?: boolean;
}

export type Button = {
  label: string;
  url: string;
  target: string;
  variant?: 'primary' | 'secondary';
};

export type RichText = {
  children: object[];
}[];

type BasicMedia = {
  width?: number;
  height?: number;
  mimeType: string;
  filesize: number;
  filename: string;
  url: string;
};
