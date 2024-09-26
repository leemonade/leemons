import { ServiceSchema } from '@leemons/deployment-manager';

export function LeemonsCacheMixin(): ServiceSchema;
export function LeemonsCacheMixin({
  redis,
  namespaces,
}: {
  redis?: string;
  namespaces?: string[];
}): ServiceSchema;
