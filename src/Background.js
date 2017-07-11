/* @flow */

import React, { PropTypes, Component } from 'react';
import { requireNativeComponent, View } from 'react-native';
import resolveAssetSource
  from 'react-native/Libraries/Image/resolveAssetSource';

const MPBackground = requireNativeComponent(
  'PaletteBackground',
  MaterialPaletteBackground,
);

// eslint-disable-next-line react/prefer-stateless-function
export default class MaterialPaletteBackground extends Component {
  static propTypes = {
    testColor: PropTypes.number,
    ...View.propTypes, // include the default view properties
  };
  render() {
    // const { source, ...rest } = this.props;
    // const src = resolveAssetSource(source);
    return <MPBackground {...this.props} />;
  }
}
