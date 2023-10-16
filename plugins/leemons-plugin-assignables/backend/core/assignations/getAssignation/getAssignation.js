async function getAssignation({assignableInstanceId, user, ctx}) {
    const assignations = await getAssignations([{ instance: assignableInstanceId, user }], {
        userSession,
        transacting,
    });

    return assignations[0];
};

module.exports = { getAssignation }