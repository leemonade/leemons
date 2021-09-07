import { Button } from 'leemons-ui';

export default function ActionButtons({ removeItems, setEditItem, toggle, field } = {}) {
  return (
    <div className="text-center">
      {/* Boton de actualizar campo */}
      <Button
        color="primary"
        text
        onClick={() => {
          setEditItem(field.schemaConfig);
          toggle();
        }}
      >
        editar
      </Button>
      {/* Boton de borrar campo */}
      <Button
        color="primary"
        text
        onClick={() => {
          removeItems((item) => item === field);
        }}
      >
        eliminar
      </Button>
    </div>
  );
}
