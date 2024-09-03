const { MongoClient } = require('mongodb');
const aws = require('aws-sdk');
const { URL } = require('url');
const http = require('http');
const https = require('https');

const TEMPLATES_INFO = {
  TEMPLATE_A: {
    name: 'school',
    domain: 'emootidemo.leemons.app',
    url: 'https://emootidemo.leemons.app',
  },
  TEMPLATE_B: {
    name: 'superior',
    domain: 'unidemo.leemons.dev',
    url: 'https://unidemo.leemons.dev/users/login',
  },
  TEMPLATE_C: {
    name: 'corporate',
    domain: 'edtdemo.leemons.app',
    url: 'https://emootidemo.leemons.app',
  },
  TEMPLATE_D: {
    name: 'master',
    domain: 'myuniversity.leemons.app',
    url: 'https://myuniversity.leemons.app',
  },
};

const templateKey = process.env.TEMPLATE_KEY;

// DEFAULTS TO LOCAL
const isLocal = !(
  process.env.LOCAL === 'false' ||
  process.env.LOCAL === 'FALSE' ||
  process.env.LOCAL === '0'
);
const localApiUrl = process.env.LOCAL_API_URL || 'http://localhost:8080';

const urlToUse = isLocal ? localApiUrl : TEMPLATES_INFO[templateKey].url;
const parsedUrl = new URL(urlToUse);
const reqModule = parsedUrl.protocol === 'https:' ? https : http;

// S3 CONFIG························································································
const s3 = new aws.S3({
  apiVersion: '2010-12-01',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'eu-west-1',
});

// DB CONFIG ·························································································································||
const localDB = 'leemons-production-templates'; //! Template B comes from a dev enviroment DB. dev === 'leemons-development-templates', produ === 'leemons-production-templates'

const dbUri =
  process.env.MONGODB_URI || process.env.MONGO_URI || `mongodb://localhost:27017/${localDB}`; // defaults to local db
const client = new MongoClient(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
let database;

async function initDB() {
  await client.connect();
  database = client.db();
}
const deploymentsCollectionKey = 'package-manager_deployments';

const getDeployment = async () => {
  const deployments = database.collection(deploymentsCollectionKey);
  return deployments.find({ domains: { $in: [TEMPLATES_INFO[templateKey].domain] } }).toArray();
};

const updateDeployment = async () => {
  const doploymentsIncludingLocalhost = await database
    .collection(deploymentsCollectionKey)
    .find({ domains: 'localhost' })
    .toArray();
  const templateDeployment = await getDeployment();

  if (
    doploymentsIncludingLocalhost.length === 1 &&
    doploymentsIncludingLocalhost[0].id === templateDeployment[0].id
  ) {
    return [];
  }

  // Remove localhost form any other deployment
  const updatePromises = doploymentsIncludingLocalhost.map((deployment) => {
    const index = deployment.domains.indexOf('localhost');
    if (index !== -1) {
      deployment.domains.splice(index, 1);
    }
    return database
      .collection(deploymentsCollectionKey)
      .updateOne({ id: deployment.id }, { $set: { domains: deployment.domains } });
  });

  // Add localhost to template deployment
  if (!templateDeployment[0].domains.includes('localhost')) {
    templateDeployment[0].domains.push('localhost');
    updatePromises.push(
      database
        .collection(deploymentsCollectionKey)
        .updateOne(
          { id: templateDeployment[0].id },
          { $set: { domains: templateDeployment[0].domains } }
        )
        .then((result) => {
          console.log('Localhost added to template deployment', result);
          return result;
        })
    );
  }

  return Promise.all(updatePromises);
};

const processDeployments = async () => {
  const updatedDeployments = await updateDeployment();
  console.log('Updated Deployments:', updatedDeployments);
};

// REQUESTS: LOGIN AND EXPORT DATA ······································································································||

const loginAndGetToken = async () => {
  const [email, password] = process.env.ADMIN_CREDENTIALS.split(':');
  const adminCredentials = { email, password };
  const data = JSON.stringify(adminCredentials);

  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || 443, // default when not local
    path: '/api/v1/users/users/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  };
  return new Promise((resolve, reject) => {
    const req = reqModule.request(options, (res) => {
      let responseBody = '';

      res.on('data', (d) => {
        responseBody += d;
      });

      res.on('end', () => {
        const cookies = res.headers['set-cookie'];
        resolve({ body: JSON.parse(responseBody), cookies });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
};

const makeRequestWithToken = async (path, jwtToken, data, method) => {
  const dataString = JSON.stringify(data);

  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || 443, // default when not local
    path,
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: jwtToken,
      'Content-Length': Buffer.byteLength(dataString),
    },
  };

  return new Promise((resolve, reject) => {
    const req = reqModule.request(options, (res) => {
      let responseBody = '';

      res.on('data', (d) => {
        responseBody += d;
      });

      res.on('end', () => {
        resolve(JSON.parse(responseBody));
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(dataString);
    req.end();
  });
};

const getProfile = async (jwtToken) => {
  const requestBody = {
    useProfile: 'Admin',
  };
  const response = await makeRequestWithToken(
    '/api/v1/users/users/profile',
    jwtToken,
    requestBody,
    'GET'
  );

  return response.profiles.find((profile) => profile.name.includes(requestBody.useProfile))?.id;
};

const getAuthToken = async (jwtToken, userProfile) => {
  const requestBody = {
    useCenters: [],
  };
  const response = await makeRequestWithToken(
    `/api/v1/users/users/profile/${userProfile}/token`,
    jwtToken,
    requestBody,
    'GET'
  );

  return response.jwtToken.centers
    .filter((center) => {
      if (requestBody.useCenters?.length) {
        return requestBody.useCenters.includes(center.name);
      }
      return true;
    })
    .map((center) => center.token);
};

const processGenerateBulkData = async (jwtToken) => {
  const requestBody = {
    noUsers: true,
    isClientManagerTemplate: true,
  };
  const response = await makeRequestWithToken(
    '/api/v1/bulk-data/bulk/generate-bulk-data',
    jwtToken,
    requestBody,
    'POST'
  );
  console.log('Response from generate bulk data:', response);
};

const processLoginAndBulkData = async () => {
  console.log('PROCESSING BULK DATA ------------------------------------------------------ ');
  const {
    body: { jwtToken },
  } = await loginAndGetToken();

  const userProfileId = await getProfile(jwtToken);
  const authToken = await getAuthToken(jwtToken, userProfileId);

  await processGenerateBulkData(authToken);
};

// MAIN ························································································································||

(async () => {
  try {
    const templateInfo = TEMPLATES_INFO[templateKey];

    if (!templateInfo) {
      console.error(`No template found with key: ${templateKey}`);
      return;
    }
    if (!process.env.ADMIN_CREDENTIALS) {
      console.error('No admin credentials found');
      return;
    }

    if (isLocal) {
      await initDB();
      await processDeployments();
    }

    await processLoginAndBulkData();

    if (isLocal) {
      await client.close();
    }
  } catch (error) {
    console.error('error', error);
    await client.close();
  }
})();
