/**
 * Chris Weed (chris@workgrid.com)
 * Copyright 2017 Workgrid Software LLC
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Animated, Modal, Platform, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'

// TODO: Hookify
class CustomActionSheet extends Component {
  constructor() {
    super()

    this.style = StyleSheet.create({
      container: {
        flex: 1,
        marginBottom: 20
      },
      modalContainer: {
        flex: 1,
        padding: 8,
        paddingBottom: 0,
        justifyContent: 'flex-end'
      },
      buttonText: {
        color: '#0069d5',
        alignSelf: 'center',
        fontSize: 18
      },
      button: {
        height: 36,
        backgroundColor: 'white',
        borderRadius: Platform.OS === 'ios' ? 6 : 2,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center',
        flex: 1,
        marginRight: 5,
        marginLeft: 5
      },
      actionBlock: {
        flexDirection: 'row'
      }
    })
  }

  render() {
    const { modalVisible, backgroundColor, children, onCancel, options, t } = this.props

    if (!modalVisible) {
      return <View />
    }

    return (
      <FadeInView visible={modalVisible} backgroundColor={backgroundColor}>
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={onCancel}>
          <View style={this.style.modalContainer}>
            <TouchableOpacity style={this.style.container} onPress={onCancel} />
            {children}
            <View style={this.style.actionBlock}>
              <TouchableHighlight style={this.style.button} onPress={onCancel}>
                <Text style={this.style.buttonText}>Cancel</Text>
              </TouchableHighlight>
              {options.buttons.map(btn => (
                <TouchableHighlight key={btn.title} style={[this.style.button, btn.style]} onPress={btn.onPress}>
                  <Text style={this.style.buttonText}>{btn.title}</Text>
                </TouchableHighlight>
              ))}
            </View>
          </View>
        </Modal>
      </FadeInView>
    )
  }
}

class FadeInView extends Component {
  constructor() {
    super()
    this.state = {
      fadeAnim: new Animated.Value(0)
    }

    this.style = StyleSheet.create({
      overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 999999
      }
    })
  }

  componentDidMount() {
    this.animate(this.props)
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    this.animate(newProps)
  }

  animate(newProps) {
    return Animated.timing(this.state.fadeAnim, {
      toValue: newProps.visible ? 0.7 : 0,
      duration: 300,
      useNativeDriver: true
    }).start()
  }

  render() {
    const { fadeAnim } = this.state
    const { backgroundColor = 'black', children } = this.props

    // For some reason the animated background refuses to actually show up
    return (
      <Animated.View style={[this.style.overlay, { opacity: fadeAnim, backgroundColor }]}>{children}</Animated.View>
    )
  }
}

FadeInView.propTypes = {
  backgroundColor: PropTypes.string,
  children: PropTypes.element.isRequired
}

CustomActionSheet.propTypes = {
  backgroundColor: PropTypes.string,
  buttonText: PropTypes.string,
  children: PropTypes.element.isRequired,
  modalVisible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  options: PropTypes.shape({
    buttons: PropTypes.array
  })
}

CustomActionSheet.defaultProps = {
  options: { buttons: [] }
}

export default CustomActionSheet
