async function deleteUserSubjectRoom({ assignation, classe, ctx }) {
  try {
    const key = ctx.prefixPN(
      `subject|${classe.subject.id}.assignation|${assignation.id}.userAgent|${assignation.user}`
    );

    await ctx.tx.call('comunica.room.remove', { key });
  } catch (error) {
    console.log(error);
    if (!error.message.endsWith('not exists')) {
      throw error;
    }
  }
}

module.exports = { deleteUserSubjectRoom };
