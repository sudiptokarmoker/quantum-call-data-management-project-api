export type ISideBannerOne = {
  id: number;
  imageId: number;
  title: string;
  link: string;
};

export type ISideBannerTwo = {
  id: number;
  imageId: number;
  title: string;
  link: string;
};

export type ISideBanner = {
  sideBannerOne: ISideBannerOne;
  sideBannerTwo: ISideBannerTwo;
  is_active?: boolean;
};
