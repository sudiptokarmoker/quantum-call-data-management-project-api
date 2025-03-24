/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { categorySearchAbleFields } from './category.constant';
import { ICategory, ICategoryFilters } from './category.interface';
import { formatCategory, getCategoryWithChildren } from './category.utility';

const getAllCategories = async () => {
  // get all categories
  const categories = await prisma.category.findMany({
    where: {
      parent_id: null,
    },
    include: {
      children: true,
      parent: false,
      products: false,
    
      image: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  for (let i = 0; i < categories.length; i++) {
    categories[i] = await getCategoryWithChildren({
      id: categories[i].id,
      isProduct: false,
    });
  }

  return categories;
};
const getAllCategoriesForMenu = async () => {
  // get all categories
  const categories = await prisma.category.findMany({
    where: {
      parent_id: null,
      is_active: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      children: true,
      parent: false,
      products: false,
      // Order: false,
      image: false,
      description: false,
      image_id: false,
      is_featured: false,
      parent_id: false,
      CanonicalUrl: true,
      categorySeoDescription: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  for (let i = 0; i < categories.length; i++) {
    categories[i] = await getCategoryWithChildren({
      id: categories[i].id,
      isProduct: false,
    });
  }

  const formattedCategories = categories.map(formatCategory);

  return formattedCategories;
};

// get all categories without children
const getAllCategoryWithoutChildren = async (
  filters: ICategoryFilters,
  paginationOptions: IPaginationOptions,
) => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    andConditions.push({
      OR: categorySearchAbleFields.map(field => ({
        [field]: {
          contains: lowerCaseSearchTerm,
        },
      })),
    });
  }

  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      AND: Object.keys(filtersData).map(key => {
        return {
          [key]: {
            contains: (filtersData as { [key: string]: string })[key],
          },
        };
      }),
    });
  }

  const whereConditions: Prisma.CategoryWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // get all categories
  const categories = await prisma.category.findMany({
    where: whereConditions,
    include: {
      children: false,
      parent: true,
      // ProductCategory: false,
      products: false,
    
      image: true,
    },
    skip,
    take: limit,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
        : { createdAt: 'desc' },
  });

  const total = await prisma.category.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: categories,
  };
};

// get category witch is active is_featured
const getFeaturedCategories = async () => {
  const categories = await prisma.category.findMany({
    where: {
      is_featured: true,
      is_active: true,
    },
    select: {
      id: true,
      name: true,
      image: true,
      slug: true,
      CanonicalUrl:true,
    },

    orderBy: {
      createdAt: 'desc',
    },
  });

  return categories;
};

// create category
const createCategory = async (categoryData: ICategory) => {
  // create unique slug from name that is not already in use
  let slug = categoryData.name.toLowerCase().replace(/ /g, '-');
  let slugExists = true;
  let counter = 1;
  while (slugExists) {
    const category = await prisma.category.findFirst({
      where: {
        slug,
      },
    });
    if (category) {
      slug = categoryData.name.toLowerCase().replace(/ /g, '-') + '-' + counter;
      counter++;
    } else {
      slugExists = false;
    }
  }
  categoryData.slug = slug;

  // create category
  const result = await prisma.category.create({
    data: categoryData,
    include: {
      children: true,
      parent: true,
      // ProductCategory: false,
      products: false,
    
      image: true,
    },
  });

  return result;
};

// get category by id
const getCategoryById = async (id: string) => {
  // get category by id
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any = await prisma.category.findFirst({
    where: {
      OR: [
        {
          id: id,
        },
        {
          slug: id,
        },
        {
          name: decodeURIComponent(id),
        },
      ],
    },
    select: {
      id: true,
      name: true,
      description: true,
      slug: true,
      children: true,
      CanonicalUrl:true,
      categorySeoDescription:true,
      parent: {
        select: {
          name: true,
          slug: true,
          parent: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
      products: {
        select: {
          id: true,
          // name: true,
          // thumbnail: {
          //   select: {
          //     image: true,
          //   },
          // },
          Brand: {
            select: {
              id: true,
              name: true,
            },
          },
          selling_price: true,
          special_price: true,
          regular_price: true,
          // specification: true,
          ProductAttribute: {
            select: {
              attribute: {
                select: {
                  name: true,
                  AttributeValue: {
                    select: {
                      value: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!result) {
    throw new Error('Category not found');
  }
  

 
  




  result = await getCategoryWithChildren({
    id: result.id,
    isProduct: true,
  });

  if (result?.products) {
    const attribute: any[] = [];
    result?.products?.forEach((product: any) => {
      product?.ProductAttribute?.forEach((productAttribute: any) => {
        const existingAttribute = attribute?.find(
          attr => attr.id === productAttribute?.attribute?.id,
        );
        if (existingAttribute) {
          productAttribute?.attributeValue?.forEach((value: any) => {
            if (
              !existingAttribute?.AttributeValue?.find(
                (v: any) => v?.id === value?.id,
              )
            ) {
              existingAttribute?.AttributeValue?.push(value);
            }
          });

          // Sort AttributeValue array by id
          existingAttribute?.AttributeValue?.sort(
            (a: any, b: any) => a?.value - b?.value,
          );
        } else {
          attribute?.push({
            id: productAttribute?.attribute?.id,
            key: 'attributeValueId',
            name: productAttribute?.attribute?.name,
            AttributeValue: productAttribute?.attributeValue,
          });
        }
      });
    });
    result.attribute = [
      ...attribute,
    ];
  }

  // provide me max price and min price of products

  if (result?.products) {
    const prices = result.products.map((product: any) => {
      // Create an array of valid prices (ignore undefined or null prices)
      const validPrices = [
        product.selling_price,
        product.special_price,
        product.regular_price,
      ].filter(price => price !== undefined && price !== null);

      


  
     
     
      // Calculate min and max from the valid prices
      const minProductPrice = Math.min(...validPrices);
      const maxProductPrice = Math.max(...validPrices);
  
      return { minProductPrice, maxProductPrice };
    });
  
    // Find the overall min and max prices across all products
    const minPrice = Math.min(...prices.map((p:any) => p.minProductPrice));
    const maxPrice = Math.max(...prices.map((p:any) => p.maxProductPrice));
  
    result.minPrice = minPrice > 0 ? minPrice: 1
    result.maxPrice = maxPrice > 0 ?  maxPrice : 1
  }
  
  
  

  delete result?.products;

  return result;
};

// update category

const updateCategory = async (id: string, categoryData: ICategory) => {
  // get category by id
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new Error('Category not found');
  }

  // check if slug is unique or not ,no need to create unique slug if slug is not updated

  if (categoryData.slug === category.slug && id !== category.id) {
    throw new Error('slug is already in use, please provide unique slug');
  }

  // update category
  const result = await prisma.category.update({
    where: {
      id,
    },
    data: categoryData,
    include: {
      children: true,
      parent: false,
      // ProductCategory: false,
      products: false,
     
    },
  });

  return result;
};

// delete category

const deleteCategory = async (id: string) => {
  // get category by id
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new Error('Category not found');
  }

  // delete category
  const result = await prisma.category.delete({
    where: {
      id,
    },
  });

  return result;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getAllCategoryWithoutChildren,
  getAllCategoriesForMenu,
  getFeaturedCategories,
};
