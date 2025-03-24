export type IOrderProduct = {
  product: {
    name: string;
  };
  quantity: number;
  price: number;
};

export type IEmailTemplateProps = {
  name: string;
  orderId: number;
  totalProduct: number;
  totalPrice: number;
  subtotal: number;
  discountAmount: number;
  deliveryAddress: string;
  orderObj: {
    createdAt: Date;
    user: {
      email?: string;
      mobile_number?: string;
    };
    paymentMethod?: string;
    isPaid: boolean;
    shippingAmount: number;
  };
  orderProduct: IOrderProduct[];
};

export const emailTemplete = ({
  name,
  orderId,
  totalPrice,
  subtotal,
  discountAmount,
  deliveryAddress,
  orderObj,
  orderProduct,
}: IEmailTemplateProps) => {
  // const productRows = orderProduct
  //   .map(productObj => {
  //     return `
  //       <tr>
  //         <td style="padding: 16px 0; border-bottom: 1px solid #f1f5f9;">
  //           <div style="font-weight: 500; color: #334155;">
  //             ${productObj.product.name}
  //           </div>
  //         </td>
  //         <td style="padding: 16px 0; border-bottom: 1px solid #f1f5f9; text-align: center;">
  //           ${productObj.quantity || 1}
  //         </td>
  //         <td style="padding: 16px 0; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 500;">
  //           ৳${productObj.price.toLocaleString()}
  //         </td>
  //       </tr>
  //     `;
  //   })
  //   .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 40px 20px; background-color: #ffffff; font-family: 'Poppins', sans-serif; color: #334155; line-height: 1.6;">
  <div style="max-width: 600px; margin: 0 auto;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px; background: #f8fafc; padding: 40px 20px;">
      <img style="max-width: 180px; margin-bottom: 20px;" 
           src="https://renesabazar.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Frenesa_logo.c363c36f.png&w=128&q=75" 
           alt="Renesa Bazaar">
      <h1 style="color: #334155; margin: 0; font-size: 24px; font-weight: 600;">Order Confirmation</h1>
    </div>

    <!-- Welcome Message -->
    <div style="margin-bottom: 40px;">
      <p style="font-size: 16px; margin: 0 0 15px 0;">Hello ${name},</p>
      <p style="margin: 0; color: #64748b;">
        Thank you for your order. We're excited to get your items to you! Here are your order details:
      </p>
    </div>

    <!-- Order Info grid template column 4 -->
    <div style="margin-bottom: 40px; display: grid; grid-template-columns: repeat(4, 1fr); justify-content: space-between; gap: 20px; align-items: center;">
      <div>
        <p style="margin: 0 0 8px 0; color: #64748b;">Order Number</p>
        <p style="margin: 0; font-size: 16px; font-weight: 500;">#${String(orderId).padStart(6, '0')}</p>
      </div>
      <div>
        <p style="margin: 0 0 8px 0; color: #64748b;">Order Date</p>
        <p style="margin: 0;">${new Date(orderObj.createdAt).toLocaleString()}</p>
      </div>
      <div>
        <p style="margin: 0 0 8px 0; color: #64748b;">Payment Status</p>
        <p style="margin: 0; color: ${orderObj.isPaid ? '#059669' : '#dc2626'};">
          ${orderObj.isPaid ? 'Paid' : 'Pending'}
        </p>
      </div>
      <div>
        <p style="margin: 0 0 8px 0; color: #64748b;">Payment Method</p>
        <p style="margin: 0;">${
          orderObj.paymentMethod
            ? orderObj.paymentMethod
                .split('_')
                .map(
                  word =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
                )
                .join(' ')
            : 'Cash on Delivery'
        }</p>
      </div>
    </div>

    <!-- Contact Information -->
    <div style="margin-bottom: 40px;">
      <h2 style="color: #334155; font-size: 18px; margin: 0 0 20px 0;">Contact Information</h2>
      <div style="margin-bottom: 12px;">
        <span style="color: #64748b; display: inline-block; width: 100px;">Email:</span>
        <span>${orderObj.user?.email || 'N/A'}</span>
      </div>
      <div>
        <span style="color: #64748b; display: inline-block; width: 100px;">Phone:</span>
        <span>${orderObj.user?.mobile_number || 'N/A'}</span>
      </div>
    </div>

    <!-- Delivery Address -->
    <div style="margin-bottom: 40px;">
      <h2 style="color: #334155; font-size: 18px; margin: 0 0 20px 0;">Delivery Address</h2>
      <p style="margin: 0; color: #475569;">${deliveryAddress}</p>
    </div>

    <!-- Order Details -->
    <div style="margin-bottom: 40px;">
      <h2 style="color: #334155; font-size: 18px; margin: 0 0 20px 0;">Order Details</h2>
      
      <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f8fafc;">
              <th style="padding: 16px; text-align: left; color: #64748b; font-weight: 500; border-bottom: 1px solid #e2e8f0;">Product</th>
              <th style="padding: 16px; text-align: center; color: #64748b; font-weight: 500; border-bottom: 1px solid #e2e8f0;">Qty</th>
              <th style="padding: 16px; text-align: right; color: #64748b; font-weight: 500; border-bottom: 1px solid #e2e8f0;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${orderProduct
              .map(
                productObj => `
              <tr>
                <td style="padding: 16px; border-bottom: 1px solid #f1f5f9;">
                  <div style="font-weight: 500; color: #334155;">
                    ${productObj.product.name}
                  </div>
                </td>
                <td style="padding: 16px; border-bottom: 1px solid #f1f5f9; text-align: center;">
                  ${productObj.quantity || 1}
                </td>
                <td style="padding: 16px; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 500;">
                  ৳${productObj.price.toLocaleString()}
                </td>
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>
      </div>

      <!-- Order Summary -->
      <div style="margin-top: 40px;">
        <div style="margin-left: auto; width: 250px;">
          <div style="margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 16px; align-items: center; gap: 10px;">
              <span style="color: #64748b;">Subtotal:</span>
              <span>৳${subtotal.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 16px; align-items: center; gap: 10px;">
              <span style="color: #64748b;">Shipping:</span>
              <span>৳${(orderObj.shippingAmount || 0).toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
              <span style="color: #64748b;">Discount:</span>
              <span>-৳${discountAmount.toLocaleString()}</span>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; padding-top: 16px; border-top: 2px solid #e2e8f0; align-items: center; gap: 10px;">
            <span style="font-weight: 600;">Total:</span>
            <span style="font-weight: 600; font-size: 18px;">৳${totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="margin-top: 60px; text-align: center; position: relative;">
      <div style="background: #f8fafc; padding: 40px 20px 30px; border-radius: 12px;">
        <p style="margin: 0 0 12px 0; font-weight: 500; color: #334155;">
          Thank you for shopping with Renesa Bazaar!
        </p>
        <p style="margin: 0; color: #64748b; font-size: 14px;">
          If you have any questions, please contact our customer service.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
};
