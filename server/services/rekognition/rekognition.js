const AWS = require('aws-sdk');
const creds = new AWS.Credentials(process.env.AWS_ACCESS_KEY, process.env.AWS_SECRET_KEY); 
const myConfig = new AWS.Config({
    credentials: creds, region: "eu-west-1"
});
const rekognition = new AWS.Rekognition(myConfig);

function assignLabels(imageData) {
    AWS.region = "eu-west-1";
    const params = {
        Image: {
            S3Object:{
                Bucket: 'bristol-interns-project',
                Name: "0aa220f92872282ef7cc2b1800527e99.jpg"
            }
        }
    };
    return new Promise((resolve, reject) => {
        rekognition.detectLabels(params, function (err, data) {
            if (err) {
                console.log(err, err.stack);
                resolve(err);
            } else {
                const labels = data.Labels.map(label => label.Name)
                resolve(labels);
            }    
        });
    });
}
