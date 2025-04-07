import { useIsTeacher } from "@academic-portfolio/hooks";
import useAssignations from "@assignables/requests/hooks/queries/useAssignations";
import useInstances from "@assignables/requests/hooks/queries/useInstances";
import { Loader, Text } from "@bubbles-ui/components";
import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Correction from "../../../components/Correction";
import StudentCorrection from "../../../components/StudentCorrection";

export default function CorrectionPage() {
  const isTeacher = useIsTeacher();
  const isFirstUser = useRef(true);
  const navigate = useNavigate();
  const { instance: instanceId } = useParams();
  let { student } = useParams();

  if (!student || student === "null" || student === "undefined") {
    student = null;
  }

  const { data: instance, error, isLoading: loading } = useInstances({ id: instanceId });

  const { data: assignation } = useAssignations({
    query: { instance: instanceId, user: student },
    fetchInstance: true,
    enabled: !!student,
  });

  const fullAssignation = useMemo(
    () => ({
      ...assignation,
      instance,
    }),
    [assignation, instance]
  );

  useEffect(() => {
    if (instance && isFirstUser.current && !student) {
      const studentToUse = instance?.students?.[0]?.user;
      if (studentToUse) {
        navigate(`/private/tasks/correction/${instanceId}/${studentToUse}`);
      }
    }
  }, [instance]);

  useEffect(() => {
    if (assignation && isFirstUser.current) {
      isFirstUser.current = false;
    }
  }, [assignation]);

  const onStudentChange = (user) => {
    navigate(`/private/tasks/correction/${instanceId}/${user}`);
  };

  useEffect(() => {
    if (!student && assignation?.user) {
      onStudentChange(assignation.user);
    }
  }, [assignation?.user]);

  if (isFirstUser.current && loading && !assignation) {
    return <Loader />;
  }
  if (error) {
    return <Text>Error: {error}</Text>;
  }

  if (isTeacher) {
    if (!assignation) {
      return null;
    }
    return <Correction assignation={fullAssignation} instance={instance} loading={loading} />;
  }
  return <StudentCorrection assignation={fullAssignation} />;
}
