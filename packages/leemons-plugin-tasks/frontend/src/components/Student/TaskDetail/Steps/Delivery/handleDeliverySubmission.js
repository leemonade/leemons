import updateStudentRequest from '../../../../../request/instance/updateStudent';

export default function handleDeliverySubmission(instance, student) {
  return async (delivery) => {
    await updateStudentRequest({
      instance,
      student,
      metadata: {
        submission: delivery,
      },
    });
  };
}
