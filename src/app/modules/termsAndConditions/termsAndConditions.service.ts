// update termsAndConditions

import prisma from '../../../shared/prisma';

type TermsAndConditions = {
  description: string;
};

// get termsAndConditions

const getTermsAndConditions = async () => {
  // get termsAndConditions
  const TermsAndConditions = await prisma.termsAndCondition.findFirst();

  return TermsAndConditions;
};

const updateTermsAndConditions = async (
  id: string,
  data: TermsAndConditions,
) => {
  // find the TermsAndConditions
  const TermsAndConditions = await prisma.termsAndCondition.findUnique({
    where: { id: id },
  });

  if (!TermsAndConditions) {
    throw new Error('TermsAndConditions not found');
  }

  // update the TermsAndConditions

  const updatedTermsAndConditions = await prisma.termsAndCondition.update({
    where: { id: id },
    data: data,
  });

  return updatedTermsAndConditions;
};

export const termsAndConditionsService = {
  updateTermsAndConditions,
  getTermsAndConditions,
};
