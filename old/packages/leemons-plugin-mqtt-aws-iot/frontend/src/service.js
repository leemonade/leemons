import { iot, mqtt } from 'aws-iot-device-sdk-v2';
import hooks from 'leemons-hooks';
import * as _ from 'lodash';
import { useEffect, useRef } from 'react';

const decoder = new TextDecoder('utf8');

let creating = false;
let retryIfFail = false;

let anyCallbacks = [];

function endDevice() {
  anyCallbacks = [];
  console.log('Frontend - Remove all listeners and disconnect');
  window.mqttAwsIotDevice.removeAllListeners('connect');
  window.mqttAwsIotDevice.removeAllListeners('interrupt');
  window.mqttAwsIotDevice.removeAllListeners('resume');
  window.mqttAwsIotDevice.removeAllListeners('disconnect');
  window.mqttAwsIotDevice.removeAllListeners('error');
  window.mqttAwsIotDevice.removeAllListeners('message');
  _.forEach(window.mqttAwsIotCredentials.topics, (topic) => {
    window.mqttAwsIotDevice.unsubscribe(topic);
  });
  window.mqttAwsIotDevice.disconnect();
  window.mqttAwsIotDevice = null;
}

async function connectWebsocket(data) {
  return new Promise((resolve, reject) => {
    const config = iot.AwsIotMqttConnectionConfigBuilder.new_builder_for_websocket()
      .with_clean_session(true)
      .with_endpoint(data.connectionConfig.host)
      .with_credentials(
        data.connectionConfig.region,
        data.connectionConfig.accessKeyId,
        data.connectionConfig.secretKey,
        data.connectionConfig.sessionToken
      )
      .with_use_websockets()
      .with_keep_alive_seconds(30)
      .build();

    window.mqttAwsIotDevice = new mqtt.MqttClient();

    window.mqttAwsIotDevice = window.mqttAwsIotDevice.new_connection(config);
    window.mqttAwsIotDevice.on('connect', () => {
      console.log('Frontend - Conectado a iot correctamente');
      resolve();
    });
    window.mqttAwsIotDevice.on('interrupt', (error) => {
      console.error('Frontend - Iot interrupt');
      console.error(error);
    });
    window.mqttAwsIotDevice.on('resume', (returnCode) => {
      console.error(`Frontend - Iot resume (${returnCode})`);
    });
    window.mqttAwsIotDevice.on('disconnect', () => {
      console.error('Frontend - Iot disconnect');
    });
    window.mqttAwsIotDevice.on('error', (error) => {
      console.error('Frontend - Ha ocurrido un error en iot');
      console.error(error);
      reject(error);
    });
    window.mqttAwsIotDevice.connect();
  });
}

async function getCredentials() {
  const data = await leemons.api(`mqtt-aws-iot/credentials`, {
    allAgents: true,
    method: 'GET',
  });
  return data.credentials;
}

async function tryConnect() {
  try {
    if (!creating) {
      creating = true;

      window.mqttAwsIotCredentials = await getCredentials();

      if (window.mqttAwsIotDevice) endDevice();
      await connectWebsocket(window.mqttAwsIotCredentials);

      _.forEach(window.mqttAwsIotCredentials.topics, (topic) => {
        window.mqttAwsIotDevice.subscribe(topic, mqtt.QoS.AtLeastOnce);
      });

      window.mqttAwsIotDevice.on('message', (t, payload) => {
        const message = JSON.parse(decoder.decode(new Uint8Array(payload)));
        _.forEach(anyCallbacks, (callback) => {
          callback(message.eventName, message.eventData);
        });
      });

      creating = false;
      retryIfFail = false;
    } else {
      retryIfFail = true;
    }
  } catch (e) {
    if (retryIfFail) {
      retryIfFail = false;
      return tryConnect();
    }
    creating = false;
  }
  return null;
}

export const SocketIotService = {
  connect: tryConnect,
  useOn: (_event, callback) => {
    const ref = useRef({ callback, event: _event });
    ref.current.callback = callback;
    ref.current.event = _event;

    const onEvent = ({ args: [{ event, data }] }) => {
      if (ref.current.event === event) {
        return ref.current.callback(event, data);
      }
      return null;
    };
    useEffect(() => {
      hooks.addAction('socket.io:onAny', onEvent);
      return () => {
        hooks.removeAction('socket.io:onAny', onEvent);
      };
    }, []);
  },
  onAny: (callback) => {
    anyCallbacks[0] = callback;
  },
  useOnAny: (callback) => {
    const ref = useRef({ callback });
    ref.current.callback = callback;
    const onEvent = ({ args: [{ event, data }] }) => {
      ref.current.callback(event, data);
    };
    useEffect(() => {
      hooks.addAction('socket.io:onAny', onEvent);
      return () => {
        hooks.removeAction('socket.io:onAny', onEvent);
      };
    }, []);
  },
  disconnect: () => {
    if (window.mqttAwsIotDevice) endDevice();
  },
};

export default SocketIotService;
