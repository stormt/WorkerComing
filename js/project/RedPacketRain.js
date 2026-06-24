'use strict'
import React, {
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  TouchableOpacity,
  Component
} from 'react-native';
import Dimensions from 'Dimensions';

var window = Dimensions.get('window');
var width = window.width;
var height = window.height;

const PACKET_COUNT = 8;
const PACKET_WIDTH = 46;
const PACKET_HEIGHT = 60;

export default class RedPacketRain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
    this._anims = [];
    this._configs = [];
    for (let i = 0; i < PACKET_COUNT; i++) {
      this._anims.push(new Animated.Value(0));
      this._configs.push(this._makeConfig(true));
    }
  }

  _makeConfig(first) {
    return {
      left: Math.random() * (width - PACKET_WIDTH),
      duration: 4000 + Math.random() * 3000,
      delay: (first ? Math.random() * 4000 : Math.random() * 1500),
      swing: (Math.random() * 40 - 20),
      rotate: (Math.random() * 50 - 25),
    };
  }

  componentDidMount() {
    this._anims.forEach((anim, i) => this._startFall(anim, i));
  }

  _startFall(anim, i) {
    let cfg = this._configs[i];
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: cfg.duration,
      delay: cfg.delay,
      easing: Easing.linear,
    }).start((result) => {
      if (!this.state.visible || !result || !result.finished) {
        return;
      }
      this._configs[i] = this._makeConfig(false);
      this._startFall(anim, i);
    });
  }

  _close() {
    this.setState({ visible: false });
  }

  _onPacketPress() {
    if (this.props.onPacketPress) {
      this.props.onPacketPress();
    }
  }

  _renderPacket(anim, i) {
    let cfg = this._configs[i];
    let translateY = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [-PACKET_HEIGHT, height + PACKET_HEIGHT],
    });
    let translateX = anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, cfg.swing, 0],
    });
    let rotate = anim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', cfg.rotate + 'deg'],
    });
    return (
      <Animated.View
        key={i}
        style={[styles.packetWrap, {
          left: cfg.left,
          transform: [{ translateX: translateX }, { translateY: translateY }, { rotate: rotate }],
        }]}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => this._onPacketPress()}>
          <View style={styles.packet}>
            <View style={styles.packetFlap} />
            <View style={styles.coin}>
              <Text style={styles.coinText}>￥</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  render() {
    if (!this.state.visible) {
      return null;
    }
    return (
      <View style={styles.container} pointerEvents="box-none">
        {this._anims.map((anim, i) => this._renderPacket(anim, i))}
        <TouchableOpacity style={styles.closeBtn} onPress={() => this._close()}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  packetWrap: {
    position: 'absolute',
    top: 0,
  },
  packet: {
    width: PACKET_WIDTH,
    height: PACKET_HEIGHT,
    backgroundColor: '#e4393c',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },
  packetFlap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 22,
    backgroundColor: '#c1272d',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: PACKET_WIDTH,
    borderBottomRightRadius: PACKET_WIDTH,
  },
  coin: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffd700',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  coinText: {
    color: '#c1272d',
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  closeBtn: {
    position: 'absolute',
    top: 70,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 20,
    lineHeight: 22,
    backgroundColor: 'transparent',
  },
});
