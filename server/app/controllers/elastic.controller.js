var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'https://search-graymatics-dev-fc6j24xphhun5xcinuusz2yfjm.ap-southeast-1.es.amazonaws.com',
  log: 'trace',
  apiVersion: '7.x', // use the same version of your Elasticsearch instance
  auth: {
    username: 'admin',
    password: 'Graymatics@1'
  }
});

exports.get = async (req,res) => {
    client.ping({
        // ping usually has a 3000ms timeout
        requestTimeout: 1000
      }, function (error) {
        if (error) {
          console.trace('elasticsearch cluster is down!');
          res.status(500).json({success: false, mess: error})
        } else {
          console.log('All is well');
          res.status(200).json({success: true})
        }
      });
  };