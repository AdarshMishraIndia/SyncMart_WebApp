export const hasOwnerPermission = (list, userEmail) => list.owner === userEmail;

export const hasMemberPermission = (list, userEmail) => 
  list.owner === userEmail || list.accessEmails?.includes(userEmail);

export const canEditListMetadata = (list, userEmail) => 
  hasOwnerPermission(list, userEmail);

export const canManageItems = (list, userEmail) => 
  hasMemberPermission(list, userEmail);