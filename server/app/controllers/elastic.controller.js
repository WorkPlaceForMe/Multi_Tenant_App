var elasticsearch = require('elasticsearch');
require('dotenv').config({ path: '../../config.env'});
var client = new elasticsearch.Client({
  host: `https://${process.env.USER_ELAST}:${process.env.PASS_ELAST}@search-graymatics-dev-fc6j24xphhun5xcinuusz2yfjm.ap-southeast-1.es.amazonaws.com`,
  log: 'trace',
  apiVersion: '7.x', // use the same version of your Elasticsearch instance
});

exports.ping = async (req,res) => {
    client.ping({
        // ping usually has a 3000ms timeout
        requestTimeout: 30000
      }, function (error) {
        if (error) {
          console.trace('elasticsearch cluster is down!');
          console.error(error)
          res.status(500).json({success: false, mess: error})
        } else {
          console.log('All is well');
          res.status(200).json({success: true})
        }
      });
  };

  exports.search = async (req,res) => {
    client.search({
        q: req.params.query
      }).then(function (body) {
        var hits = body.hits.hits;
        res.status(200).json({success: true, data: hits})
      }, function (error) {
        console.trace(error.message);
        res.status(500).json({success: false, mess: error})
      });
  };

  exports.info = async (req,res) => {
    client.info().then(function (body) {
        var hits = body;
        res.status(200).json({success: true, data: hits})
      }, function (error) {
        console.trace(error.message);
        res.status(500).json({success: false, mess: error})
      });
  };