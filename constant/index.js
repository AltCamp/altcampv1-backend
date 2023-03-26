module.exports = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',

  ACCOUNT_TYPES: {
    STUDENT: 'Student',
    MENTOR: 'Mentor',
    ADMIN: 'Admin',
  },

  RESPONSE_MESSAGE: {
    SUCCESS: 'Request Successful!',
    FAILED: 'Request Failed!',
    LOGOUT: 'You have been logged out!',
    CREATE_SUCCESSFUL: (entity) => `${entity} created successfully`,
    CONFLICT: (entity) => `${entity} exists already`,
  },
};
