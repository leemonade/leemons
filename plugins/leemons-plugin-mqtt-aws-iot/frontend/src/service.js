import { useEffect, useRef } from 'react';
import { iot, mqtt } from 'aws-iot-device-sdk-v2';
import _ from 'lodash';
import hooks from 'leemons-hooks';

const decoder = new TextDecoder('utf8');

const SOCKET_ON_ANY = 'socket.io:onAny';

let creating = false;
let retryIfFail = false;
let connected = false;

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
      connected = true;
      resolve();
    });
    window.mqttAwsIotDevice.on('interrupt', (error) => {
      console.error('Frontend - Iot interrupt');
      connected = false;
      console.error(error);
    });
    window.mqttAwsIotDevice.on('resume', (returnCode) => {
      connected = true;
      console.error(`Frontend - Iot resume (${returnCode})`);
    });
    window.mqttAwsIotDevice.on('disconnect', () => {
      console.error('Frontend - Iot disconnect');
      connected = false;
    });
    window.mqttAwsIotDevice.on('error', (error) => {
      console.error('Frontend - Ha ocurrido un error en iot');
      console.error(error);
      connected = false;
      reject(error);
    });
    window.mqttAwsIotDevice.connect();
  });
}

async function getCredentials() {
  const data = await leemons.api(`v1/mqtt-aws-iot/socket/credentials`, {
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
    connected = false;
  }
  return null;
}

export const SocketIotService = {
  isConnected: () => connected,
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
      hooks.addAction(SOCKET_ON_ANY, onEvent);
      return () => {
        hooks.removeAction(SOCKET_ON_ANY, onEvent);
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
      hooks.addAction(SOCKET_ON_ANY, onEvent);
      return () => {
        hooks.removeAction(SOCKET_ON_ANY, onEvent);
      };
    }, []);
  },
  disconnect: () => {
    if (window.mqttAwsIotDevice) endDevice();
  },
  isCreating: () => creating,
};

export default SocketIotService;
