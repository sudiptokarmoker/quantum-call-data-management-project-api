// create orders
import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { emailTemplete } from '../../../helpers/emailTemplate';
import { sendMail } from '../../../helpers/nodeMailer';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { CouponService } from '../coupon/coupon.service';
import { IOrder, IOrderFilters } from './order.interface';

const createOrder = async (orderData: IOrder) => {
  const { products, userId, couponCode, total, ...orderDetails } = orderData;

  let couponDiscount = 0;
  let appliedCoupon = null;

  if (couponCode) {
    const couponResult = await CouponService.applyCoupon(
      couponCode,
      total ?? 0,
    );

    if (couponResult.isValid && couponResult.coupon) {
      couponDiscount = couponResult.discount;
      appliedCoupon = couponResult.coupon;
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, couponResult.message);
    }
  }

  // Create order
  const order = await prisma.order.create({
    data: {
      userId: userId,
      ...orderDetails,
      couponId: appliedCoupon?.id,
      discountAmount: couponDiscount,
      total: total,
      products: {
        create: products.map(product => ({
          productId: product.productId,
          quantity: product.quantity,
          price: product.price,
          total: product.total,
        })),
      },
    },
    select: {
      id: true,
      subTotal: true,
      discountAmount: true,
      total: true,
      address: {
        select: {
          address_line_one: true,
          address_line_two: true,
          area: true,
          district: true,
          thana: true,
          zip_code: true,
        },
      },
      products: {
        select: {
          price: true,
          quantity: true,
          product: {
            select: {
              name: true,
            },
          },
        },
      },
      createdAt: true,
      user: {
        select: {
          email: true,
          first_name: true,
          last_name: true,
          mobile_number: true,
        },
      },
      paymentMethod: true,
      isPaid: true,
      shippingAmount: true,
    },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { orderId: String(order.id).padStart(6, '0') },
  });

  // get user info
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      first_name: true,
      last_name: true,
    },
  });

  // send email to user without waiting for it to complete

  await sendMail(
    user!.email,
    'New Order Confirmation - Order #' + order?.id,
    ``,
    emailTemplete({
      name: `${user!.first_name + ' ' + user!.last_name}`,
      deliveryAddress: `${order?.address?.address_line_one},${order?.address?.address_line_two},${order?.address?.area},${order?.address?.district},${order?.address?.thana},${order?.address?.zip_code} `,
      discountAmount: order?.discountAmount ?? 0,
      orderId: order?.id,
      subtotal: order?.subTotal ?? 0,
      totalPrice: order?.total ?? 0,
      totalProduct: order?.products?.length,
      orderObj: {
        ...order,
        createdAt: order?.createdAt,
        isPaid: order?.isPaid,
        shippingAmount: order?.shippingAmount ?? 0,
        user: {
          email: order?.user?.email,
          mobile_number: order?.user?.mobile_number,
        },
      },
      orderProduct: order?.products,
    }),
  )
    .then(() => console.log('Email sent successfully'))
    .catch(error => console.error('Failed to send email:', error));

  /*
  await sendMail(user!.email, 'Order Confirmation', ``,
    emailTemplete({
      name:`${user!.first_name + " " + user!.last_name }`,
      deliveryAddress :`${order?.address?.address_line_one},${order?.address?.address_line_two},${order?.address?.area},${order?.address?.district},${order?.address?.thana},${order?.address?.zip_code} `,
      discountAmount: order?.discountAmount ?? 0,
      orderId:order?.id,
      subtotal: order?.subTotal ?? 0,
      totalPrice: order?.total ?? 0,
      totalProduct: order?.products?.length 
    })
  )
    .then(() => console.log('Email sent successfully'))
    .catch(error => console.error('Failed to send email:', error));
    */

  /**
   * send this same email to admin to order track
   */

  await sendMail(
    config.mail.sales_email!,
    'Order Confirmation' + order?.id,
    ``,
    emailTemplete({
      name: `${user!.first_name + ' ' + user!.last_name}`,
      deliveryAddress: `${order?.address?.address_line_one},${order?.address?.address_line_two},${order?.address?.area},${order?.address?.district},${order?.address?.thana},${order?.address?.zip_code} `,
      discountAmount: order?.discountAmount ?? 0,
      orderId: order?.id,
      subtotal: order?.subTotal ?? 0,
      totalPrice: order?.total ?? 0,
      totalProduct: order?.products?.length,
      orderObj: {
        ...order,
        createdAt: order?.createdAt,
        shippingAmount: order?.shippingAmount ?? 0,
        user: {
          email: order?.user?.email,
          mobile_number: order?.user?.mobile_number,
        },
      },
      orderProduct: order?.products,
    }),
  )
    .then(() => console.log('Email sent successfully to sales'))
    .catch(error => console.error('Failed to send email:', error));

  return order;
};
// cancel order

const cancelOrder = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: { id: Number(id) },
    include: { products: true },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  if (order.status !== 'pending') {
    throw new Error('Order cannot be cancelled');
  }

  await prisma.order.update({
    where: { id: Number(id) },
    data: { status: 'cancelled' },
  });

  return order;
};

// get single order

const getSingleOrder = async (id: string, userId: string) => {
  const result = await prisma.order.findFirst({
    where: { id: Number(id), userId: userId },
    select: {
      address: true,
      discountAmount: true,
      id: true,
      isPaid: true,
      paymentMethod: true,
      shippingAmount: true,
      orderId: true,
      status: true,
      subTotal: true,
      total: true,
      products: {
        select: {
          id: true,
          price: true,
          productId: true,
          quantity: true,
          total: true,
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              thumbnail: true,
              special_price: true,
              regular_price: true,
              selling_price: true,
              stock: true,
              warranty: true,
              warranty_time: true,
            },
          },
        },
      },
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!result) {
    throw new Error('Order not found');
  }

  return result;
};

// get all orders

const getAllOrders = async (
  filters: IOrderFilters,
  paginationOptions: IPaginationOptions,
) => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, isPaid, paymentMethod, status, orderId } = filters;

  const andConditions = [];

  if (searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    andConditions.push({
      OR: [
        {
          orderId: {
            contains: lowerCaseSearchTerm,
          },
        },
        // {
        //   status: {
        //     contains: lowerCaseSearchTerm,
        //   },
        // },
        // { paymentMethod: { equals: lowerCaseSearchTerm } },
      ],
    });
  }

  if (isPaid !== undefined) {
    andConditions.push({
      isPaid: isPaid === 'true'.toLowerCase() ? true : false,
    });
  }

  if (paymentMethod) {
    andConditions.push({ paymentMethod });
  }

  if (status) {
    andConditions.push({ status });
  }

  if (orderId) {
    andConditions.push({ orderId });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereConditions: any =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const orders = await prisma.order.findMany({
    where: whereConditions,
    select: {
      address: true,
      user: {
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          mobile_number: true,
        },
      },
      discountAmount: true,
      id: true,
      isPaid: true,
      paymentMethod: true,
      shippingAmount: true,
      orderId: true,
      status: true,
      subTotal: true,
      total: true,
      products: {
        select: {
          id: true,
          price: true,
          productId: true,
          quantity: true,
          total: true,
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              thumbnail: true,
              special_price: true,
              regular_price: true,
              selling_price: true,
              stock: true,
            },
          },
        },
      },
      createdAt: true,
      updatedAt: true,
    },
    skip,
    take: limit,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
        : { createdAt: 'desc' },
  });

  const total = await prisma.order.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: orders,
  };
};
// getSingleOrderForAdmin
const getSingleOrderForAdmin = async (id: string) => {
  const result = await prisma.order.findFirst({
    where: { id: Number(id) },
    select: {
      address: true,
      discountAmount: true,
      id: true,
      isPaid: true,
      paymentMethod: true,
      shippingAmount: true,
      orderId: true,
      status: true,
      subTotal: true,
      user: {
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          mobile_number: true,
        },
      },
      total: true,
      products: {
        select: {
          id: true,
          price: true,
          productId: true,
          quantity: true,
          total: true,
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              thumbnail: true,
              special_price: true,
              regular_price: true,
              selling_price: true,
              stock: true,
              warranty: true,
              warranty_time: true,
            },
          },
        },
      },
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!result) {
    throw new Error('Order not found');
  }

  return result;
};

// change order status

const changeOrderStatus = async (
  id: string,
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled',
) => {
  const order = await prisma.order.findUnique({
    where: { id: Number(id) },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  // Prevent changing the status if the order is already completed
  if (order.status === 'completed') {
    throw new Error('Order is already completed and cannot be changed');
  }

  // If the new status is 'completed', set isPaid to true
  const updatedData =
    status === 'completed' ? { status, isPaid: true } : { status };

  await prisma.order.update({
    where: { id: Number(id) },
    data: updatedData,
  });

  return order;
};

export const orderService = {
  createOrder,
  cancelOrder,
  getSingleOrder,
  getAllOrders,
  getSingleOrderForAdmin,
  changeOrderStatus,
};
