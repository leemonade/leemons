import Router, { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const getDynamicComponent = (c) =>
  dynamic(() => import(`@users/components/${c}`), {
    loading: () => <p>Loading...</p>,
  });

export default function DynamicComponentExample(props) {
  const DynamicComponent = getDynamicComponent(Router.router?.query.componentName);

  return (
    <>
      <div>Componente dinámico:</div>
      <DynamicComponent />
    </>
  );
}
