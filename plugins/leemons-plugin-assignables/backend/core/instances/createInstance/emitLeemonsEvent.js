function emitLeemonsEvent({ assignable, instance, ctx }) {
  const { role, id } = assignable;

  const payload = {
    role,
    assignable: id,
    instance,
  };

  ctx.tx.emit(`instance.created`, payload);
  ctx.tx.emit(`role.${role}.instance.created`, payload);
}

module.exports = { emitLeemonsEvent };
