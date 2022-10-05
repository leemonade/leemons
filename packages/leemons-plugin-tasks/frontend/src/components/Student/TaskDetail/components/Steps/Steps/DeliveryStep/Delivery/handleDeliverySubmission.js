import updateStudentRequest from '@tasks/request/instance/updateStudent';

export default function handleDeliverySubmission(assignation) {
  return async (delivery, shouldRemove = false) => {
    await updateStudentRequest({
      instance: assignation.instance.id,
      student: assignation.user,
      metadata: {
        ...assignation.metadata,
        submission: shouldRemove ? null : delivery,
      },
    });

    // eslint-disable-next-line no-param-reassign
    assignation.metadata = {
      ...assignation.metadata,
      submission: shouldRemove ? null : delivery,
    };
  };
}
