import prisma from '../../../shared/prisma';
import { getLastNDays } from '../../../shared/utils';

const getAnalytics = async () => {
  const last30Days = getLastNDays(30);
  const last7Days = getLastNDays(7);

  // Overview metrics
  const totalUsers = await prisma.user.count();
  const totalProducts = await prisma.product.count();
  const totalOrders = await prisma.order.count();
  const totalBrands = await prisma.brand.count();
  const totalOutlets = await prisma.outlet.count();
  const totalRevenue = await prisma.order.aggregate({
    _sum: {
      total: true,
    },
  });

  // User Analytics
  const userAnalytics = await prisma.user.findMany({
    take: 10,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      mobile_number: true,
      createdAt: true,
      _count: {
        select: {
          orders: true,
          ProductReview: true,
        },
      },
      orders: {
        select: {
          total: true,
        },
      },
    },
  });

  // Product Analytics
  const productAnalytics = await prisma.product.findMany({
    take: 10,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      name: true,
      selling_price: true,
      regular_price: true,
      stock: true,
      is_active: true,
      _count: {
        select: {
          productReview: true,
          productQA: true,
          OrderProduct: true,
        },
      },
      productReview: {
        select: {
          rating: true,
        },
      },
    },
  });

  // Brand Analytics
  const brandAnalytics = await prisma.brand.findMany({
    take: 10,
    select: {
      id: true,
      name: true,
      is_active: true,
      _count: {
        select: {
          products: true,
        },
      },
      products: {
        select: {
          selling_price: true,
          OrderProduct: {
            select: {
              quantity: true,
              total: true,
            },
          },
        },
      },
    },
  });

  // Outlet Analytics
  const outletAnalytics = await prisma.outlet.findMany({
    take: 10,
    select: {
      id: true,
      name: true,
      address: true,
      phone: true,
      email: true,
      is_active: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  // Shipping Analytics
  const shippingAnalytics = await prisma.shipping.findMany({
    include: {
      district: true,
    },
  });

  // Order Analytics with detailed status breakdown
  const orderAnalytics = {
    statusCounts: await prisma.order.groupBy({
      by: ['status'],
      _count: true,
      _sum: {
        total: true,
      },
    }),
    paymentMethodCounts: await prisma.order.groupBy({
      by: ['paymentMethod'],
      _count: true,
      _sum: {
        total: true,
      },
    }),
    recentOrders: await prisma.order.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        products: {
          include: {
            product: {
              select: {
                name: true,
                sku: true,
              },
            },
          },
        },
        address: true,
      },
    }),
  };

  // Active Offers Analytics
  const offerAnalytics = await prisma.offers.findMany({
    where: {
      offerEndTime: {
        gte: new Date(),
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      offerStartTime: true,
      offerEndTime: true,
      offerType: true,
      discountType: true,
      discount: true,
      isShowedHome: true,
      _count: {
        select: {
          product: true,
        },
      },
    },
  });

  // Sales Trends
  const salesTrends = {
    last30Days: await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: last30Days,
        },
      },
      _sum: {
        total: true,
      },
    }),
    last7Days: await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: last7Days,
        },
      },
      _sum: {
        total: true,
      },
    }),
  };

  // Calculate average ratings and revenue per product
  const productsWithMetrics = productAnalytics.map(product => ({
    ...product,
    averageRating: product.productReview.length 
      ? product.productReview.reduce((acc, review) => acc + review.rating, 0) / product.productReview.length 
      : 0,
  }));

  // Calculate total revenue per brand
  const brandsWithRevenue = brandAnalytics.map(brand => ({
    ...brand,
    totalRevenue: brand.products.reduce((acc, product) => 
      acc + product.OrderProduct.reduce((sum, order) => sum + order.total, 0), 0
    ),
  }));

  return {
    overview: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalBrands,
      totalOutlets,
      totalRevenue: totalRevenue._sum.total || 0,
    },
    userAnalytics: userAnalytics.map(user => ({
      ...user,
      totalOrderAmount: user.orders.reduce((sum, order) => sum + (order.total || 0), 0),
    })),
    productAnalytics: productsWithMetrics,
    brandAnalytics: brandsWithRevenue,
    outletAnalytics,
    shippingAnalytics,
    orderAnalytics,
    offerAnalytics,
    salesTrends,
  };
};

export const DashboardService = {
  getAnalytics,
}; 