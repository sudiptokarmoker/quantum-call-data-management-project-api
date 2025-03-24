/* eslint-disable @typescript-eslint/no-explicit-any */
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { createRandomString, slugify } from './products.utilities';

import { getAllChildCategoryIds } from './products.utilities';

import {
  productsRelationalFields,
  productsRelationalFieldsMapper,
} from './products.constant';
import {
  IProduct,
  IProductAttribute,
  IProductFilters,
} from './products.interface';

// create product
const createProduct = async (product: IProduct) => {
  // create unique sku for each product, name is string and category is id, also brand also id

  if (!product.sku) {
    //product.sku = `${product.name}-${product.category}`;
    product.sku = createRandomString(10);
  }

  // check if SKU is unique or not
  const isSkuExists = await prisma.product.findFirst({
    where: {
      sku: product.sku,
    },
  });

  if (isSkuExists) {
    //product.sku = `${product.name}-${Math.floor(Math.random() * 10) + 1}`;
    product.sku = createRandomString(10);
  }

  // slug
  if (!product.slug) {
    product.slug = slugify(product.name.replace(/\//g, '-'))
      .toLowerCase()
      .replace(/ /g, '-');
  }

  // check if slug is unique or not
  const isSlugExists = await prisma.product.findFirst({
    where: {
      slug: product.slug,
    },
  });

  if (isSlugExists) {
    product.slug = `${product.name.toLowerCase().replace(/ /g, '-')}-${Math.floor(Math.random() * 1000) + 1}`;
  }

  // get last product code
  const lastProduct = await prisma.product.findFirst({
    orderBy: {
      product_code: 'desc',
    },
  });

  if (lastProduct) {
    product.product_code = (lastProduct.product_code || 0) + 1;
  } else {
    product.product_code = 1;
  }

  // if images, attribute, and outlet are empty, then throw an error
  if (!product.images.length) {
    throw new Error('Images are required');
  } else if (!product.outlet.length) {
    throw new Error('Outlet is required');
  } else if (!product.category) {
    throw new Error('Category is required');
  }

  product.ProductAttribute = product.ProductAttribute.filter(attribute => {
    return attribute.attributeValue?.length > 0;
  });

  const result = await prisma.product.create({
    data: {
      name: product.name,
      specification: product.specification,
      key_features: product.key_features,
      description: product.description,
      CanonicalUrl: product.CanonicalUrl,
      unit: product.unit,
      weight: product.weight,
      category: {
        connect: product.category.map((categoryId: string) => ({
          id: categoryId,
        })),
      },
      images: {
        create: product.images.map((imageId: number, index: number) => ({
          imageId,
          sort_order: index,
        })),
      },
      ProductAttribute: {
        create: product.ProductAttribute.map(
          (attribute: IProductAttribute) => ({
            attribute: {
              connect: {
                id: attribute.atrributeId,
              },
            },
            attributeValue: {
              connect: attribute.attributeValue.map((value: string) => ({
                id: value,
              })),
            },
          }),
        ),
      },
      selling_price: product.selling_price,
      regular_price: product.regular_price,
      special_price: product.special_price,
      product_code: product.product_code,
      watt: product.watt,
      outlet: {
        connect: product.outlet.map((outletId: string) => ({
          id: outletId,
        })),
      },
      stock: product.stock,
      lowStockAlert: product.lowStockAlert,
      is_active: product.is_active,
      is_featured: product.is_featured,
      thumbnail: {
        connect: {
          id: product.thumbnailId,
        },
      },
      // dynamic_banner
      dynamic_banner: product?.dynamic_banner_id
        ? {
            connect: {
              id: product.dynamic_banner_id,
            },
          }
        : undefined,

      video_link: product?.video_link,

      seo: {
        create: {
          title: product?.seo?.title ?? '',
          description: product?.seo?.description ?? '',
          meta_description_in_head:
            product?.seo?.meta_description_in_head ?? '',
        },
      },
      tags: {
        create: product.tags.map((tagId: string) => ({
          name: tagId,
        })),
      },
      sku: product.sku,
      slug: product.slug,
      Brand: {
        connect: {
          id: product.brandId,
        },
      },
      warranty: product?.warranty ?? 0, // Updated field
      warranty_time: product?.warranty_time, // Updated field
      product_disclaimer: product?.product_disclaimer, // Updated field
    },
  });

  return result;
};

// get all products

const getAllProducts = async (
  filters: IProductFilters,
  paginationOptions: IPaginationOptions,
) => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);
  const {
    searchTerm,
    minPrice,
    maxPrice,
    attributeValueId,
    BrandIds,
    CategoryIds,
    outletIds,
    warranty,
    warranty_time,
    category,
    pc_builder_parent_product_ids,
    camera_builder_parent_product_ids,
    ...filtersData
  } = filters;

  const andConditions = [];

  if (searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const stringFields = ['name', 'slug', 'unit', 'brandId'];
    const numericFields = [
      'selling_price',
      'regular_price',
      'special_price',
      'stock',
      'weight',
      'product_code',
    ];

    type SearchFieldCondition = {
      [x: string]: { contains?: string; equals?: number };
    };

    const searchFieldsConditions: SearchFieldCondition[] = stringFields.map(
      field => ({
        [field]: {
          contains: lowerCaseSearchTerm,
        },
      }),
    );

    if (!isNaN(Number(searchTerm))) {
      numericFields.forEach(field => {
        searchFieldsConditions.push({
          [field]: { equals: Number(searchTerm) },
        });
      });
    }

    andConditions.push({
      OR: searchFieldsConditions,
    });
  }

  // filter by relational fields
  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      AND: Object.keys(filtersData).map(key => {
        if (productsRelationalFields.includes(key)) {
          return {
            [productsRelationalFieldsMapper[key]]: {
              some: {
                OR: [
                  {
                    id: {
                      equals: (filtersData as any)[key],
                    },
                  },
                  {
                    name: {
                      equals: (filtersData as any)[key],
                    },
                  },
                ],
              },
            },
          };
        } else {
          return {
            [key]: {
              equals: (filtersData as any)[key],
            },
          };
        }
      }),
    });
  }

  // add minPrice and maxPrice filter for selling_price
  if (minPrice && maxPrice) {
    andConditions.push({
      OR: [
        {
          regular_price: {
            gte: Number(minPrice),
            lte: Number(maxPrice),
          },
        },
        {
          selling_price: {
            gte: Number(minPrice),
            lte: Number(maxPrice),
          },
        },
        {
          special_price: {
            gte: Number(minPrice),
            lte: Number(maxPrice),
          },
        },
      ],
    });
  }

  // add attributeValueId filter for attributeValue
  const attributeValueIds = attributeValueId?.split(',');

  if (attributeValueIds && attributeValueIds?.length > 0) {
    andConditions.push({
      ProductAttribute: {
        some: {
          attributeValue: {
            some: {
              id: {
                in: attributeValueIds,
              },
            },
          },
        },
      },
    });
  }

  // add BrandIds filter for Brand
  const brandIds = BrandIds?.split(',');

  if (brandIds && brandIds?.length > 0) {
    andConditions.push({
      Brand: {
        id: {
          in: brandIds,
        },
      },
    });
  }

  // add CategoryIds filter for Category
  const categoryId = CategoryIds?.split(',');

  if (categoryId && categoryId?.length > 0) {
    andConditions.push({
      category: {
        some: {
          id: {
            in: categoryId,
          },
        },
      },
    });
  }

  if (
    category &&
    !pc_builder_parent_product_ids &&
    !camera_builder_parent_product_ids
  ) {
    const allCategoryIds = await getAllChildCategoryIds(category);

    // Flatten the array of arrays
    const flattenedCategoryIds = allCategoryIds?.flat();

    andConditions.push({
      category: {
        some: {
          id: {
            in: flattenedCategoryIds,
          },
        },
      },
    });
  }
  // add outletIds filter for outlet
  const outletsId = outletIds?.split(',');

  if (outletsId && outletsId?.length > 0) {
    andConditions.push({
      outlet: {
        some: {
          id: {
            in: outletsId,
          },
        },
      },
    });
  }

  // add warranty filter
  if (warranty) {
    andConditions.push({
      warranty: {
        contains: warranty,
      },
    });
  }

  // add warranty_time filter
  if (warranty_time) {
    andConditions.push({
      warranty_time: {
        equals: warranty_time,
      },
    });
  }

  // pc builder

  if (pc_builder_parent_product_ids && category) {
    const pcBuilderParentProductIds = pc_builder_parent_product_ids.split(',');

    // Find products where parent_product_id is in the list
    const parentProducts = await prisma.product.findMany({
      where: {
        category: {
          some: {
            id: category,
          },
        },
        parentRelations: {
          some: {
            parent_product_id: {
              in: pcBuilderParentProductIds,
            },
          },
        },
      },
      include: {
        parentRelations: true,
      },
    });

    if (parentProducts.length === 0) {
      // If no parent products found, return category matched products
      const allCategoryIds = await getAllChildCategoryIds(category);

      // Flatten the array of arrays
      const flattenedCategoryIds = allCategoryIds?.flat();

      andConditions.push({
        category: {
          some: {
            id: {
              in: flattenedCategoryIds,
            },
          },
        },
      });
    } else {
      // Extract the all parentRelations.relative_product_id of the parent products
      const relativeProductIds = parentProducts.map(product =>
        product.parentRelations.map(
          parentRelation => parentRelation.relative_product_id,
        ),
      );

      // Flatten the array of arrays
      const flattenedRelativeProductIds = relativeProductIds.flat();

      andConditions.push({
        id: {
          in: flattenedRelativeProductIds,
        },
      });
    }
  }

  // camera builder
  if (camera_builder_parent_product_ids && category) {
    const cameraBuilderParentProductIds =
      camera_builder_parent_product_ids.split(',');

    // Find products where parent_product_id is in the list
    const parentProducts = await prisma.product.findMany({
      where: {
        category: {
          some: {
            id: category,
          },
        },
        cameraParentRelations: {
          some: {
            parent_product_id: {
              in: cameraBuilderParentProductIds,
            },
          },
        },
      },
      include: {
        cameraParentRelations: true,
        category: true,
      },
    });

    if (parentProducts.length === 0) {
      // If no parent products found, return category matched products
      const allCategoryIds = await getAllChildCategoryIds(category);

      // Flatten the array of arrays
      const flattenedCategoryIds = allCategoryIds?.flat();

      andConditions.push({
        category: {
          some: {
            id: {
              in: flattenedCategoryIds,
            },
          },
        },
      });
    } else {
      // Extract the all parentRelations.relative_product_id of the parent products
      const relativeProductIds = parentProducts.map(product =>
        product.cameraParentRelations.map(
          cameraParentRelations => cameraParentRelations.relative_product_id,
        ),
      );

      // Flatten the array of arrays
      const flattenedRelativeProductIds = relativeProductIds.flat();

      andConditions.push({
        id: {
          in: flattenedRelativeProductIds,
        },
      });
    }
  }

  const whereConditions: any =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result: any = await prisma.product.findMany({
    where: whereConditions,
    include: {
      images: {
        select: {
          image: true,
          sort_order: true,
        },
        orderBy: {
          sort_order: 'asc',
        },
      },
      Brand: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },

      thumbnail: true,
      Offers: {
        include: {
          banner: true,
        },
      },
      dynamic_banner: true,
      ProductAttribute: {
        select: {
          attribute: {
            select: {
              id: true,
              name: true,
            },
          },
          attributeValue: {
            select: {
              id: true,
              value: true,
            },
          },
        },
      },
      tags: true,
      seo: true,
      outlet: true,
      category: true,
      // product_disclaimer: true,

      cameraParentRelations: true,
      parentRelations: true,
    },
    skip,
    take: limit,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
        : { createdAt: 'desc' },
  });

  const total = await prisma.product.count({
    where: whereConditions,
  });

  await result.forEach((product: any) => {
    product.images = product?.images?.map((image: any) => image?.image);
  });

  // add key data as id for each product
  result?.forEach((product: any) => {
    product.key = product?.id;
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

// get is_active products and is_featured products

const getActiveFeaturedProducts = async () => {
  const result = await prisma.product.findMany({
    where: {
      AND: [
        {
          is_active: true,
        },
        {
          is_featured: true,
        },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      stock: true,
      watt: true,
      thumbnail: {
        select: {
          image: true,
        },
      },
      Offers: {
        include: {
          banner: true,
        },
      },
      selling_price: true,
      regular_price: true,
      special_price: true,
      CanonicalUrl: true,
      warranty: true,
      warranty_time: true,
      product_disclaimer: true,
      category: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return result;
};

// get product by id or slug

const getProductByIdOrSlug = async (id: string) => {
  const result = await prisma.product.findFirst({
    where: {
      OR: [
        {
          id: id,
        },
        {
          slug: id,
        },
      ],
    },
    include: {
      images: {
        include: {
          image: true,
        },
        orderBy: {
          sort_order: 'asc',
        },
      },
      Brand: true,
      thumbnail: true,
      Offers: {
        include: {
          banner: true,
        },
      },
      dynamic_banner: true,
      ProductAttribute: {
        include: {
          attribute: true,
          attributeValue: true,
        },
      },
      productReview: {
        where: {
          status: 'approved',
        },
        include: {
          user: {
            select: {
              first_name: true,
              last_name: true,
              email: true,
              mobile_number: true,
            },
          },
        },
      },

      outlet: true,
      category: true,
      tags: true,
      seo: true,
    },
  });

  if (!result) {
    throw new Error('Product not found');
  }

  return result;
};

// update product

const updateProduct = async (id: string, product: IProduct) => {
  if (!product.images.length) {
    throw new Error('Images is required');
  } else if (!product.outlet.length) {
    throw new Error('Outlet is required');
  } else if (!product.category) {
    throw new Error('Category is required');
  }

  // Check if categories exist
  const categories = await prisma.category.findMany({
    where: {
      id: {
        in: product.category,
      },
    },
  });

  if (categories.length !== product.category.length) {
    throw new Error('Some categories do not exist');
  }

  // Check if outlets exist
  const outlets = await prisma.outlet.findMany({
    where: {
      id: {
        in: product.outlet,
      },
    },
  });

  if (outlets.length !== product.outlet.length) {
    throw new Error('Some outlets do not exist');
  }

  const result = await prisma.product.update({
    where: {
      id,
    },
    data: {
      name: product.name,
      specification: product.specification,
      key_features: product.key_features,
      description: product.description,
      CanonicalUrl: product.CanonicalUrl,
      unit: product.unit,
      weight: product.weight,
      category: {
        set: product.category.map((categoryId: string) => ({
          id: categoryId,
        })),
      },
      images: {
        deleteMany: {},
        create: product.images.map((imageId: number, index: number) => ({
          imageId,
          sort_order: index,
        })),
      },

      ProductAttribute: {
        deleteMany: {},
        create: product.ProductAttribute.map(
          (attribute: IProductAttribute) => ({
            attribute: {
              connect: {
                id: attribute.atrributeId,
              },
            },
            attributeValue: {
              connect: attribute.attributeValue.map((value: string) => ({
                id: value,
              })),
            },
          }),
        ),
      },

      selling_price: product.selling_price,
      regular_price: product.regular_price,
      special_price: product.special_price,
      watt: product.watt,

      outlet: {
        connect: product.outlet.map((outletId: string) => ({
          id: outletId,
        })),
      },

      stock: product.stock,
      lowStockAlert: product.lowStockAlert,
      is_active: product.is_active,
      is_featured: product.is_featured,

      thumbnail: {
        connect: {
          id: product.thumbnailId,
        },
      },

      // dynamic_banner

      dynamic_banner: product?.dynamic_banner_id
        ? {
            connect: {
              id: product.dynamic_banner_id,
            },
          }
        : undefined,

      video_link: product?.video_link,

      seo: {
        update: {
          title: product?.seo?.title ?? '',
          description: product?.seo?.description ?? '',
          meta_description_in_head:
            product?.seo?.meta_description_in_head ?? '',
        },
      },

      tags: {
        deleteMany: {},
        create: product.tags.map((tagId: string) => ({
          name: tagId,
        })),
      },
      sku: product.sku,
      slug: product.slug,
      Brand: {
        connect: {
          id: product.brandId,
        },
      },
      // Include the new fields
      warranty: product.warranty,
      warranty_time: product.warranty_time,
      product_disclaimer: product.product_disclaimer,
    },
  });

  return result;
};

// bulk update product price and stock

const bulkUpdateProductPriceAndStock = async (
  products: {
    id: string;
    selling_price: number;
    regular_price: number;
    special_price: number;
    stock: number;
    outlet: string[];
  }[],
) => {
  const results = [];

  for (const product of products) {
    const result = await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        selling_price: Number(product.selling_price),
        regular_price: Number(product.regular_price),
        special_price: Number(product.special_price),
        stock: Number(product.stock),
        outlet: {
          set: product.outlet.map((outletId: string) => ({
            id: outletId,
          })),
        },
      },
    });

    results.push(result);
  }

  return results;
};

// copy product by id

const copyProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      images: {
        include: {
          image: true,
        },
      },
      thumbnail: true,
      ProductAttribute: {
        include: {
          attribute: true,
          attributeValue: true,
        },
      },
      tags: true,
      seo: true,
      outlet: true,
      category: true,
    },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  // add copy suffix to the slug
  product.slug = `${product.slug}-copy-${Math.floor(Math.random() * 1000) + 6}`;

  // add copy suffix to the sku

  product.sku = `${product.sku}-copy-${Math.floor(Math.random() * 1000) + 6}`;

  // get last product code
  const lastProduct = await prisma.product.findFirst({
    orderBy: {
      product_code: 'desc',
    },
  });

  if (lastProduct) {
    product.product_code = (lastProduct.product_code || 0) + 1;
  } else {
    product.product_code = 1;
  }

  const newProduct = await prisma.product.create({
    data: {
      name: product.name,
      specification: product.specification,
      key_features: product.key_features,
      description: product.description,
      CanonicalUrl: product.CanonicalUrl,
      slug: product.slug + '-copy',
      sku: product.sku,
      unit: product.unit,
      weight: product.weight,
      product_code: product.product_code,
      category: {
        connect: product.category.map(category => ({
          id: category.id,
        })),
      },
      images: {
        create: product.images.map((image, index) => ({
          imageId: image.imageId,
          sort_order: index,
        })),
      },
      ProductAttribute: {
        create: product.ProductAttribute.map(attribute => ({
          attribute: {
            connect: {
              id: attribute.attribute.id,
            },
          },
          attributeValue: {
            connect: attribute.attributeValue.map(value => ({
              id: value.id,
            })),
          },
        })),
      },
      selling_price: product.selling_price,
      regular_price: product.regular_price,
      special_price: product.special_price,
      watt: product.watt,
      outlet: {
        connect: product.outlet.map(outlet => ({
          id: outlet.id,
        })),
      },
      stock: product.stock,
      lowStockAlert: product.lowStockAlert,
      is_active: product.is_active,
      is_featured: product.is_featured,
      thumbnail: {
        connect: {
          id: product.thumbnail.id,
        },
      },
      seo: {
        create: {
          title: product?.seo?.title ?? '',
          description: product?.seo?.description ?? '',
        },
      },
      tags: {
        create: product.tags.map(tag => ({
          name: tag.name,
        })),
      },
    },
  });

  return newProduct;
};

// delete product

const deleteProduct = async (id: string) => {
  try {
    // Start transaction
    const result = await prisma.$transaction(async prisma => {
      // Verify product exists
      const productExists = await prisma.product.findUnique({
        where: { id },
      });
      if (!productExists) {
        throw new Error(`Product with ID ${id} does not exist.`);
      }

      // Delete references
      await prisma.productImage.deleteMany({ where: { productId: id } });

      await prisma.tag.deleteMany({ where: { productId: id } });

      await prisma.productAttribute.deleteMany({ where: { productId: id } });

      await prisma.productReview.deleteMany({ where: { productId: id } });

      await prisma.popularSearchProduct.deleteMany({
        where: { productId: id },
      });

      await prisma.pCBuilderProductSave.deleteMany({
        where: { productId: id },
      });

      const deleteResult = await prisma.product.delete({ where: { id } });

      return deleteResult;
    });

    // Return result
    return result;
  } catch (error) {
    // Log and rethrow error for further handling
    console.error('Failed to delete product:', error);
    throw error;
  }
};

/**
 * for product slug update
 */

// Function to update product slugs
const updateProductSlugs = async () => {
  try {
    // Fetch all products where slug contains special characters like '#'
    const products = await prisma.product.findMany({
      where: {
        slug: {
          contains: '#', // You can add more patterns for other special characters if needed
        },
      },
    });

    // Loop through each product and sanitize its slug
    for (const product of products) {
      const oldSlug = product.slug;
      const newSlug = slugify(oldSlug);

      // Update the product with the new slug
      if (newSlug !== oldSlug) {
        await prisma.product.update({
          where: {
            id: product.id,
          },
          data: {
            slug: newSlug,
          },
        });
        console.log(
          `Updated slug for product ID ${product.id}: ${oldSlug} -> ${newSlug}`,
        );
      }
    }
    console.log('All product slugs updated successfully.');
  } catch (error) {
    console.error('Error updating product slugs:', error);
  }
};

export const productsService = {
  createProduct,
  getAllProducts,
  getProductByIdOrSlug,
  updateProduct,
  deleteProduct,
  getActiveFeaturedProducts,
  bulkUpdateProductPriceAndStock,
  copyProductById,
  updateProductSlugs,
};
