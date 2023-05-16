/*
 * Sacar todas las instancias donde deadline sea mayor a hoy y menor
 * que dentro de 15.
 * Sacamos todas las asignaciones para esas instancias y esos usuarios
 * Ahora sacamos para esas asignaciones cuales tienen fecha de start y dichas asignaciones la borramos por que ya estan empezadas.
 *
 *
 * Consultar grades donde {
 *  type: 'main',
 *  date: mayor que hace 7 dias
 * }
 * Teniendo los grades miramos dentro de las fechas que asignaciones tienen el name = 'end'
 *
 * Ahora con las asignaciones que tengan fecha fin sacamos el detalle para los usuarios que tenemos
 * */

module.exports = {
  modelName: 'dates',
  attributes: {
    type: {
      type: 'string',
    },
    // If type == assignableInstance then instance is the assignableInstanceId
    // If type == assignation then instance is the assignationId
    instance: {
      type: 'string',
    },
    // type == assignation -> end, open, start
    // type == assignableInstance -> deadline
    name: {
      type: 'string',
    },
    date: {
      type: 'datetime',
    },
  },
};
