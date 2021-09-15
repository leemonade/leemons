import { Button } from 'leemons-ui';
import {
  useTranslationsDrawer,
  TranslationsDrawer,
} from '@classroom/components/multilanguage/translationsDrawer';

export default function Test() {
  const { drawer, toggleDrawer } = useTranslationsDrawer();
  return (
    <>
      <p>Hola Mundo,bienvenidos al test de las traducciones</p>
      <Button color="primary" onClick={toggleDrawer}>
        Alternar Drawer
      </Button>
      <TranslationsDrawer drawer={drawer} toggleDrawer={toggleDrawer} />
    </>
  );
}
