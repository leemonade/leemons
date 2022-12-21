module.exports = [
  /**
   * Assignable Instances
   */
  {
    method: 'GET',
    path: '/assignableInstances',
    handler: 'assignableInstance.search',
    authenticated: true,
  },
  {
    method: 'GET',
    path: '/assignableInstances/:id',
    handler: 'assignableInstance.get',
    authenticated: true,
  },
  {
    method: 'PUT',
    path: '/assignableInstances/:id',
    handler: 'assignableInstance.update',
    authenticated: true,
  },
  {
    method: 'POST',
    path: '/assignableInstances/reminder',
    handler: 'assignableInstance.sendReminder',
    authenticated: true,
  },
  /**
   * Assignations
   */
  {
    method: 'GET',
    path: '/assignableInstances/:instance/assignations/:user',
    handler: 'assignations.get',
    authenticated: true,
  },
  /**
   * Activities
   */
  {
    method: 'GET',
    path: '/activities/search/ongoing',
    handler: 'activities.searchOngoing',
    authenticated: true,
  },
  {
    method: 'GET',
    path: '/activities/search/nya',
    handler: 'activities.searchNyaActivities',
    authenticated: true,
  },
];
