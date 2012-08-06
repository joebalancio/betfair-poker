define(function(require, exports, module) {
  module.exports = {
    fadeIn: {
      alpha: 1,
      duration: 0.5,
      easing: 'strong-ease-in'
    },
    fadeOut: {
      alpha: 0,
      duration: 0.5,
      easing: 'strong-ease-out'
    },
    visible: {
      alpha: 1,
    },
    visible50: {
      alpha: 0.5,
    },
    hidden: {
      alpha: 0,
    },
    flipIn: {
      scale: {
        x: 0.1,
        y: 1,
      },
      alpha: 1,
      duration: 0.2,
      easing: 'strong-ease-in'
    },
    flipOut: {
      scale: {
        x: 1,
        y: 1,
      },
      duration: 0.2,
      easing: 'strong-ease-out'
    }
  };
});
