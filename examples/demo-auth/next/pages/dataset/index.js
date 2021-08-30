import { withLayout } from '@layout/hoc';
import { useDatasetItemDrawer } from '@dataset/components/DatasetItemDrawer';
import { Button } from 'leemons-ui';

function UserTest() {
  const [toggle, DatasetItemDrawer] = useDatasetItemDrawer();

  return (
    <div>
      <Button color="primary" onClick={toggle}>
        Open dataset modal
      </Button>
      <DatasetItemDrawer />
    </div>
  );
}

export default withLayout(UserTest);
