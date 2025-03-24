export type IHomePageBannerOne = {
  id: string;
  image_id: number;
  link: string;
};

export type IHomePageBannerTwo = {
  id: string;
  image_id: number;
  link: string;
};

export type IHomePageBanner = {
  homePageBannerOne: IHomePageBannerOne;
  homePageBannerTwo: IHomePageBannerTwo;
  is_active?: boolean;
};
