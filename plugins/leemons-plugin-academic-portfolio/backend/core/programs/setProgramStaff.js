async function setProgramStaff({ programId, staff, ctx }) {
  const deletePromises = Object.entries(staff)
    .filter(([, value]) => value === null)
    .map(([role]) => ctx.tx.db.ProgramStaff.deleteOne({ program: programId, role }));

  const updatePromises = Object.entries(staff)
    .filter(([, value]) => value)
    .map(([role, userAgent]) =>
      ctx.tx.db.ProgramStaff.findOneAndUpdate(
        { program: programId, role },
        { $set: { userAgent } },
        {
          upsert: true,
          lean: true,
          new: true,
        }
      )
    );

  const [, finalStaff] = await Promise.all([
    Promise.all(deletePromises),
    Promise.all(updatePromises),
  ]);

  const staffByRoles = finalStaff.reduce(
    (acc, { role, userAgent }) => ({
      ...acc,
      [role]: userAgent,
    }),
    {}
  );

  await ctx.tx.emit('after-set-program-staff', {
    programId,
    staff: staffByRoles,
  });

  return staffByRoles;
}

module.exports = { setProgramStaff };
