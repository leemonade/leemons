import updateStudentRequest from '../../../../../request/instance/updateStudent';

export default function handleDeliverySubmission(instance, student) {
  return async (delivery, shouldRemove = false) => {
    await updateStudentRequest({
      instance,
      student,
      metadata: {
        submission: shouldRemove ? null : delivery,
      },
    });
  };
}
