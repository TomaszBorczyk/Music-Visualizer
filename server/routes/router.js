

module.exports = (app)=>{
  const index = require('./index'),
        trackRoutes = require('./tracks'),
        userRoutes = require('./users');


  app.use('/', index);
  app.use('/api/v1/track', trackRoutes);
  app.use('/api/v1/user', userRoutes);
};
