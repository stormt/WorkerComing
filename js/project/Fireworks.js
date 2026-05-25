'use strict'
import React,{
  StyleSheet,
  View,
  Animated,
  Component
} from 'react-native';
import Dimensions from 'Dimensions';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

var COLORS = ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#448AFF', '#40C4FF', '#69F0AE', '#FFFF00', '#FFD740', '#FF6E40'];
var PARTICLE_COUNT = 12;

class SingleFirework extends Component {
  constructor(props) {
    super(props);
    this._mounted = false;
    this.riseAnim = new Animated.Value(0);
    this.riseOpacity = new Animated.Value(1);
    this.particles = [];
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      this.particles.push({
        x: new Animated.Value(0),
        y: new Animated.Value(0),
        opacity: new Animated.Value(0),
      });
    }
    this.state = {
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      originX: Math.random() * (screenWidth - 60) + 30,
      targetY: -(Math.random() * screenHeight * 0.3 + screenHeight * 0.15),
    };
  }

  componentDidMount() {
    this._mounted = true;
    this._delayTimer = setTimeout(() => {
      if (this._mounted) {
        this._startAnimation();
      }
    }, this.props.delay || 0);
  }

  componentWillUnmount() {
    this._mounted = false;
    if (this._delayTimer) {
      clearTimeout(this._delayTimer);
    }
    if (this._restartTimer) {
      clearTimeout(this._restartTimer);
    }
  }

  _resetValues() {
    this.riseAnim.setValue(0);
    this.riseOpacity.setValue(1);
    this.particles.forEach(function(p) {
      p.x.setValue(0);
      p.y.setValue(0);
      p.opacity.setValue(0);
    });
  }

  _startAnimation() {
    if (!this._mounted) return;

    this._resetValues();

    var newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    var newOriginX = Math.random() * (screenWidth - 60) + 30;
    var newTargetY = -(Math.random() * screenHeight * 0.3 + screenHeight * 0.15);
    this.setState({color: newColor, originX: newOriginX, targetY: newTargetY});

    var riseDuration = 800 + Math.random() * 400;

    var riseAnimation = Animated.parallel([
      Animated.timing(this.riseAnim, {
        toValue: 1,
        duration: riseDuration,
      }),
      Animated.timing(this.riseOpacity, {
        toValue: 0,
        duration: riseDuration,
      }),
    ]);

    var explodeAnimations = this.particles.map(function(p, i) {
      var angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      var distance = 30 + Math.random() * 60;
      var dx = Math.cos(angle) * distance;
      var dy = Math.sin(angle) * distance;

      return Animated.parallel([
        Animated.timing(p.x, {toValue: dx, duration: 700}),
        Animated.timing(p.y, {toValue: dy + 20, duration: 700}),
        Animated.sequence([
          Animated.timing(p.opacity, {toValue: 1, duration: 50}),
          Animated.timing(p.opacity, {toValue: 0, duration: 650}),
        ]),
      ]);
    });

    var self = this;
    Animated.sequence([
      riseAnimation,
      Animated.parallel(explodeAnimations),
    ]).start(function() {
      if (self._mounted) {
        self._restartTimer = setTimeout(function() {
          self._startAnimation();
        }, Math.random() * 1000 + 500);
      }
    });
  }

  render() {
    var color = this.state.color;
    var originX = this.state.originX;
    var targetY = this.state.targetY;

    var riseY = this.riseAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, targetY],
    });

    var particleViews = this.particles.map(function(p, i) {
      return (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            width: 5,
            height: 5,
            borderRadius: 3,
            backgroundColor: color,
            opacity: p.opacity,
            transform: [{translateX: p.x}, {translateY: p.y}],
          }}
        />
      );
    });

    return (
      <View style={{position: 'absolute', left: originX, bottom: 20}} pointerEvents="none">
        <Animated.View style={{
          width: 3,
          height: 12,
          borderRadius: 2,
          backgroundColor: color,
          opacity: this.riseOpacity,
          transform: [{translateY: riseY}],
        }} />
        <Animated.View style={{
          position: 'absolute',
          left: 0,
          top: 0,
          transform: [{translateY: riseY}],
        }}>
          {particleViews}
        </Animated.View>
      </View>
    );
  }
}

export default class Fireworks extends Component {
  render() {
    return (
      <View style={styles.container} pointerEvents="none">
        <SingleFirework delay={0} />
        <SingleFirework delay={600} />
        <SingleFirework delay={1200} />
        <SingleFirework delay={1900} />
        <SingleFirework delay={2600} />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
});
