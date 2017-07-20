const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const Track  = require('../../app/models/track.model');
const should = chai.should();

chai.use(chaiHttp);

const models = [
    {
        name: 'track',
        model: Track
    }
];


describe('Tracks:', ()=>{

  beforeEach((done)=>{
    Track.remove({}, (err)=>{
      console.log('track collection removed');
      done();
    })
  })

  describe('GET:', ()=>{
    it('should get all tracks', (done)=>{
      chai.request(server)
          .get('/api/v1/track')
          .end((err, res)=>{
            res.should.have.status(200);
          });
      done();
    });
  });

  describe('POST:', ()=>{
    it('should post track', function(done){
      var mockTrack = new Track( {
          name: 'Crazy frog',
          link: 'youtu.be/crazyfrog',
          created_date: Date.now()
        });

      Track.create(mockTrack, function(err, track){
        if(err) return done(err);
        console.log('track created');
        done();
      })
    })
  })

});
