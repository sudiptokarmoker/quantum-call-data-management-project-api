import express from 'express';
import { AuthRoutes } from '../modules/user/user.routes';
import { PermissionGroupRoutes } from '../modules/permission_group/permission_group.route';
import { PermissionRoute } from '../modules/permission/permission.route';
import { UserRoleRoute } from '../modules/UserRole/UserRole.route';
import { UserRoutes } from '../modules/user-managment/user-managment.route';
import { BrandRoute } from '../modules/brand/brand.route';
import { blogRouter } from '../modules/blog/blog.route';
import { blogCategoryRouter } from '../modules/blogCategory/blogCategory.route';
import { categoryRouter } from '../modules/category/category.route';
import { AttributesRoute } from '../modules/attributes/attributes.route';
import { galleryRoute } from '../modules/gallery/gallery.route';
import { outletRouter } from '../modules/outlet/outlet.route';
import { productsRoute } from '../modules/products/products.route';
import { bannerRouter } from '../modules/banner/banner.route';
import { sideBannerRouter } from '../modules/sideBanner/sidebanner.route';
import { PcBuilderRoutes } from '../modules/pc_builder/pc_builder.route';
import { PcBuilderSaveRoute } from '../modules/pc_builder_save/pc_builder_save.route';
import { districtAndDivisionRouter } from '../modules/districtAndDivition/districtAndDivition.route';
import { shippingRoutes } from '../modules/shipping/shipping.route';
import { orderRoutes } from '../modules/order/order.route';
import { UnitRoute } from '../modules/unit/unit.route';
import { homeSeoRoutes } from '../modules/homeSeo/homeSeo.route';
import { becomeDealerRouter } from '../modules/becomeDealer/becomeDealer.route';
import { productReviewRoute } from '../modules/productReview/productReview.route';
import { popularSearchProductRoute } from '../modules/popularSearchProduct/popularSearchProduct.route';
import { searchVolumeRoute } from '../modules/searchVolume/searchVolume.route';
import { termsAndConditionsRoutes } from '../modules/termsAndConditions/termsAndConditions.route';
import { offersRoute } from '../modules/offers/offers.route';
import { CameraBuilderRoutes } from '../modules/camera_builder/camera_builder.route';
import { CameraBuilderSaveRoute } from '../modules/camera_builder_save/camera_builder_save.route';
import { PcBuilderRelationalProductRoutes } from '../modules/pc_builder_relational_product/pc_builder_relational_product.route';
import { CameraBuilderRelationalProductRoutes } from '../modules/camera_builder_relational_product/camera_builder_relational_product.route';
import { HomePageBannerRouter } from '../modules/HomePageBanner/HomePageBanner.route';
import { pixelRouter } from '../modules/pixel/pixel.route';
import { bannerRouterFrontend } from '../modules/banner/frontend/banner.route';
import { DashboardRoutes } from '../modules/dashboard/dashboard.route';
import { CouponRoutes } from '../modules/coupon/coupon.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    routes: AuthRoutes,
  },
  {
    path: '/permission-group',
    routes: PermissionGroupRoutes,
  },
  {
    path: '/permission',
    routes: PermissionRoute,
  },
  {
    path: '/user-role',
    routes: UserRoleRoute,
  },
  {
    path: '/user',
    routes: UserRoutes,
  },
  {
    path: '/brand',
    routes: BrandRoute,
  },
  {
    path: '/blogs',
    routes: blogRouter,
  },
  {
    path: '/blog-category',
    routes: blogCategoryRouter,
  },
  {
    path: '/category',
    routes: categoryRouter,
  },
  {
    path: '/attribute',
    routes: AttributesRoute,
  },
  {
    path: '/image-upload',
    routes: galleryRoute,
  },
  {
    path: '/outlet',
    routes: outletRouter,
  },
  {
    path: '/product',
    routes: productsRoute,
  },
  {
    path: '/banner',
    routes: bannerRouter,
  },
  {
    path: '/side-banner',
    routes: sideBannerRouter,
  },
  {
    path: '/pc-builder',
    routes: PcBuilderRoutes,
  },
  {
    path: '/pc-builder-save',
    routes: PcBuilderSaveRoute,
  },
  {
    path: '/camera-builder',
    routes: CameraBuilderRoutes,
  },
  {
    path: '/camera-builder-save',
    routes: CameraBuilderSaveRoute,
  },
  {
    path: '/country',
    routes: districtAndDivisionRouter,
  },
  {
    path: '/shipping',
    routes: shippingRoutes,
  },
  {
    path: '/orders',
    routes: orderRoutes,
  },
  {
    path: '/unit',
    routes: UnitRoute,
  },
  {
    path: '/home-seo',
    routes: homeSeoRoutes,
  },
  {
    path: '/become-dealer',
    routes: becomeDealerRouter,
  },
  {
    path: '/product-review',
    routes: productReviewRoute,
  },
  {
    path: '/popular-search-product',
    routes: popularSearchProductRoute,
  },
  {
    path: '/search-volume',
    routes: searchVolumeRoute,
  },
  {
    path: '/terms-and-conditions',
    routes: termsAndConditionsRoutes,
  },
  {
    path: '/offers',
    routes: offersRoute,
  },
  {
    path: '/pc-builder-relational-product',
    routes: PcBuilderRelationalProductRoutes,
  },
  {
    path: '/camera-builder-relational-product',
    routes: CameraBuilderRelationalProductRoutes,
  },
  {
    path: '/coupon',
    routes: CouponRoutes,
  },
  {
    path: '/home-banner',
    routes: HomePageBannerRouter,
  },
  {
    path: '/pixel',
    routes: pixelRouter,
  },
  /**
   * some frontend routes
   */
  {
    path: '/banner-frontend',
    routes: bannerRouterFrontend,
  },
  {
    path: '/dashboard',
    routes: DashboardRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));
export default router;
