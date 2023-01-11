module.exports = {
  modelName: 'events',
  collectionName: 'events',
  options: {
    useTimestamps: true,
  },
  attributes: {
    title: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    startDate: {
      type: 'datetime',
      /* // Los tasks pueden no tener fecha
      options: {
        notNull: true,
      },
       */
    },
    endDate: {
      type: 'datetime',
      /* // Los tasks pueden no tener fecha
       options: {
         notNull: true,
       },
        */
    },
    isAllDay: {
      type: 'boolean',
    },
    repeat: {
      type: 'string',
    },
    type: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    status: {
      type: 'string',
      options: {
        notNull: true,
        defaultTo: 'active',
      },
    },
    data: {
      type: 'text',
      textType: 'mediumText',
    },
    isPrivate: {
      type: 'boolean',
      options: {
        defaultTo: false,
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};

/*
 * Cuando una persona crea un evento y a los participantes se les añadan los permisos de view, el propio creador del evento tambien se tiene que añadir
 * Si yo mismo le doy a borrar, si tengo invitados se cancela el evento (Marcar status: cancel), si no tengo invitados se borra tod lo que tiene que ver con el evento
 * Si yo u otra persona añadida al evento rechazo/acepto el evento hay que guardar que yo mismo lo he rechazado/aceptado
 * Si otra persona añadida le da a borrar se le tiene que quitar el permiso de ver dicho evento
 *
 * /borrar
 *  Si yo, y solo borrar
 *  Si yo y invitados marcar como cancel
 *  Si otro, borrar permiso ver
 * /cancelar/aceptar
 *  Da igual que persona se marca como cancelado o aceptado
 * */
