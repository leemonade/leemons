import { Stack, SearchInput, Select, Button, Box } from '@bubbles-ui/components';
import { RemoveCircleIcon } from '@bubbles-ui/icons/outline';

const Filters = () => {
  return (
    <Stack spacing={4} alignItems="center">
      <SearchInput label="Buscar" placeholder="Buscar..." />
      <Select label="Tipo" data={[]} />
      <Select label="Asignatura" data={[]} />
      <Select label="Etiquetas" data={[]} />
      <Box mt={24}>
        <Button variant="linkInline" leftIcon={<RemoveCircleIcon />}>
          Limpiar
        </Button>
      </Box>
    </Stack>
  );
};

export { Filters };
