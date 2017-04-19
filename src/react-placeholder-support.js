import React, { Component } from 'react';

const createShimmedElement = (elementName) => {
  const isPlaceholderSupported = (typeof document !== 'undefined') && 'placeholder' in document.createElement('input');
  return class PlaceholderPolyfill extends Component {
    static displayName = elementName.replace(/^(.)/, c => c.toUpperCase());

    constructor(props) {
      super(props);

      this.needsPlaceholding = props.placeholder && !isPlaceholderSupported;
    }

    componentWillReceiveProps = (props) => {
      this.needsPlaceholding = props.placeholder && !isPlaceholderSupported;
    };

    componentDidUpdate = () => {
      this.setSelectionIfNeeded(this.elementNode);
    };

    // keep track of focus
    onFocus = (e) => {
      this.hasFocus = true;
      this.setSelectionIfNeeded(e.target);

      if (this.props.onFocus) {
        return this.props.onFocus(e);
      }
    };

    onBlur = (e) => {
      this.hasFocus = false;

      if (this.props.onBlur) {
        return this.props.onBlur(e);
      }
    };

    setSelectionIfNeeded = (node) => {
      // if placeholder is visible, ensure cursor is at start of input
      if (this.needsPlaceholding &&
        this.hasFocus &&
        this.isPlaceholding &&
        (node.selectionStart !== 0 || node.selectionEnd !== 0) &&
        node.setSelectionRange) {
        node.setSelectionRange(0, 0);

        return true;
      }

      return false;
    };

    onChange = (e) => {
      const onChange = this.props.onChange;

      if (this.isPlaceholding) {
        // remove placeholder when text is added
        const value = e.target.value;
        const index = value.indexOf(this.props.placeholder);

        if (index !== -1) {
          e.target.value = value.slice(0, index);
        }
      }

      if (onChange) {
        return onChange(e);
      }
    };

    onSelect = (e) => {
      if (this.isPlaceholding) {
        this.setSelectionIfNeeded(e.target);

        return false;
      } else if (this.props.onSelect) {
        return this.props.onSelect(e);
      }
    };

    render() {
      let value;
      let newProps;

      if (this.needsPlaceholding) {
        value = this.props.value;

        this.isPlaceholding = !value;

        newProps = {
          ...this.props,
          onFocus: this.onFocus,
          onBlur: this.onBlur,
          onChange: this.onChange,
          onSelect: this.onSelect,
          value: value ? value : this.props.placeholder,
          type: !value ? 'text' : this.props.type,
          className: !value ? this.props.className + ' placeholder' : this.props.className
        }
      }

      const element = React.createElement(elementName, newProps || this.props, this.props.children);

      this.elementNode = element;
      return element;
    }
  }
};

export default createShimmedElement;
