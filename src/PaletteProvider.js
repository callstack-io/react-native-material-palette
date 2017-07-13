/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import createEventEmitter from './eventEmitter';
import MaterialPalette from './index';

import type { PaletteInstance, Image, Options, PaletteDefaults } from './types';

export const KEY = '__react-native-material-palette__';

type Props = {
  /**
   * Image from which to generate the palette
   */
  image: Image,
  /**
   * Options for palette generation
   */
  options?: Options,
  defaults?: PaletteDefaults,
  /**
   * Children
   */
  children: React$Element<*>,
  /**
   * Error handler, called when palette generation fails
   */
  onError?: (error: Error) => void,
  /**
   * Initialization handler, called right before generation the palette
   */
  onInit?: () => void,
  /**
   * Finish handler, called right after the palette is generated
   */
  onFinish?: (
    palette: PaletteInstance,
    globalDefaults: PaletteDefaults,
  ) => void,
  /**
   * Render `null` or passed component when the palette is being generated
   */
  waitForPalette?: boolean | React$Component<*, *, *>,
};

type State = {
  palette: ?PaletteInstance,
};

function execIfFunction(possibleFunction: mixed, ...args: *) {
  if (typeof possibleFunction === 'function') {
    possibleFunction(...args);
  }
}

/**
 * Provides broadcast for material palette instance via context.
 * Passes `subscribe` method via context, which `withPalette` can call
 * and subscribe in order to receive the palette instance.
 */
export default class MaterialPaletteProvider
  extends Component<void, Props, State> {
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      palette: null,
    };
  }
  static childContextTypes = {
    [KEY]: PropTypes.func.isRequired,
  };

  eventEmitter = createEventEmitter(null);

  getChildContext() {
    return {
      ...this.context,
      [KEY]: this.eventEmitter.subscribe,
    };
  }

  componentWillMount() {
    execIfFunction(this.props.onInit);
    MaterialPalette.create(this.props.image, this.props.options)
      .then((palette: PaletteInstance) => {
        execIfFunction(this.props.onFinish, palette, this.props.defaults);
        if (this.props.waitForPalette) {
          this.setState({ palette });
        }
        this.eventEmitter.publish({
          palette,
          globalDefaults: this.props.defaults,
        });
      })
      .catch((error: Error) => {
        execIfFunction(this.props.onError, error);
      });
  }

  render() {
    if (this.props.waitForPalette && !this.state.palette) {
      return typeof this.props.waitForPalette === 'boolean'
        ? null
        : <this.props.waitForPalette />;
    }
    return this.props.children;
  }
}