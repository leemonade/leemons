import type { AnyContext } from '@leemons/moleculer';
import type { Model } from '@leemons/mongodb';
import { hasKey, setKey } from '@leemons/mongodb-helpers';
import type { GetKeyValueModel } from '@leemons/mongodb-helpers';
import { map } from 'lodash';

interface AssignableRole {
  role: string;
  options: Record<string, any>;
}

interface RegisterAssignableRolesDeployParams {
  keyValueModel: Model<GetKeyValueModel>;
  assignableRoles: AssignableRole[];
  ctx: AnyContext;
}

export async function registerAssignableRolesDeploy({
  keyValueModel,
  assignableRoles,
  ctx,
}: RegisterAssignableRolesDeployParams): Promise<void> {
  if (!(await hasKey(keyValueModel, 'init-assignables'))) {
    await Promise.allSettled(
      map(assignableRoles, (role) =>
        ctx.tx.call('assignables.roles.registerRole', {
          role: role.role,
          ...role.options,
        })
      )
    );
    await setKey(keyValueModel, 'init-assignables');
  }
}
