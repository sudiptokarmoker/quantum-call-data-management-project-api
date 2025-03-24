
import prisma from '../../../shared/prisma';

export function createRandomString(length:number): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result + Date.now();
}


export const getAllChildCategoryIds = async (
  categoryId: string,
  allCategoryIds: string[] = [],
): Promise<string[]> => {
  // Fetch the child categories for the given categoryId
  const childCategories = await prisma.category.findMany({
    where: {
   
    parent_id: categoryId,
    },
    select: {
      id: true,
    },
  });

  // Add the current category ID to the list
  allCategoryIds.push(categoryId);

  // Recursively fetch child categories
  for (const childCategory of childCategories) {
    await getAllChildCategoryIds(childCategory.id, allCategoryIds);
  }

  return allCategoryIds;
};
  

export const slugify = (text: string) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};
