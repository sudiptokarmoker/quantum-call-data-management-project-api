import prisma from '../../../shared/prisma';

type IProps = {
  id: string;
  isProduct?: boolean;
};

export async function getCategoryWithChildren({ id, isProduct }: IProps) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      children: true,
      products: isProduct
        ? {
            select: {
              id: true,
              name: true,
              // thumbnail: {
              //   select: {
              //     image: true,
              //   },
              // },
              selling_price: true,
              special_price: true,
              regular_price: true,
              Brand: {
                select: {
                  id: true,
                  name: true,
                },
              },
              // specification: true,
              // stock: true,
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
            },
          }
        : false,

      image: true,
      
    },
  });

  if (!category) {
    throw new Error(`Category with id ${id} not found`);
  }

  if (category.children) {
    for (let i = 0; i < category.children.length; i++) {
      const childCategory = await getCategoryWithChildren({
        id: category.children[i].id,
      });
      if (childCategory) {
        category.children[i] = childCategory;
      }
    }
  }

  return category;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatCategory = (category: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formattedCategory: any = {
    // key: category.id,
    label: category.name,

    key: category.slug,
  };

  if (category.children && category.children.length > 0) {
    const formattedChildren = category.children.map(formatCategory);
    if (formattedChildren.length > 0) {
      formattedCategory.children = formattedChildren;
    }
  }

  return formattedCategory;
};

// export default getCategoryWithChildren;
