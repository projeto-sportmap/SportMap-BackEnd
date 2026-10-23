// Arquivo: src/security/permissions.ts
export type Role = 'USUARIO' | 'ADMIN';
export type Permission = 'usuarios:read:any';

const permissions: Record<Role, readonly Permission[]> = {
  USUARIO: [],
  ADMIN: ['usuarios:read:any'],
};

export function hasPermission(role: string, permission: Permission): boolean {
  if (role !== 'USUARIO' && role !== 'ADMIN') return false;
  return permissions[role].includes(permission);
}