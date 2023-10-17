import SocketIotService from '@mqtt-aws-iot/service';
import { SocketIoService } from '@mqtt-socket-io/service';
import PropTypes from 'prop-types';

SocketIoService.connect = SocketIotService.connect;
SocketIoService.useOn = SocketIotService.useOn;
SocketIoService.onAny = SocketIotService.onAny;
SocketIoService.useOnAny = SocketIotService.useOnAny;
SocketIoService.disconnect = SocketIotService.disconnect;

export function Provider({ children }) {
  return children;
}

Provider.propTypes = {
  children: PropTypes.node,
};

export default null;
