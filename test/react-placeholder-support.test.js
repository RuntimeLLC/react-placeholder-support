import React from 'react';
import ReactPlaceholderSupport from '../src/react-placeholder-support';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

// Mock createElement for doesn't support placholder
const createElement = document.createElement;
const spy = jest.fn((inp) => {
  if (inp === 'input') {
    return {};
  }

  return createElement(inp);
});
document.createElement = spy;
// end mock

const Textarea = ReactPlaceholderSupport('textarea');
const FAKE_EVENT = { target: { value: '' } };

describe('render snapshots', () => {
  test('set value like placeholder', () => {
    const tree = renderer.create(
      React.createElement(Textarea, { placeholder: "placeholder" })
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  test('set value', () => {
    const tree = renderer.create(
      React.createElement(Textarea, { placeholder: "placeholder", value: "value" })
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});

describe('react placeholder support', () => {
  describe('constructor', () => {
    test('displayName', () => {
      expect(Textarea.displayName).toBe('Textarea')
    });

    test('should needsPlaceholding', () => {
      const textarea = shallow(
        React.createElement(Textarea, { placeholder: "placeholder" })
      );

      expect(textarea.instance().needsPlaceholding).toBeTruthy();
    });

    test('should not needsPlaceholding', () => {
      const textarea = shallow(
        React.createElement(Textarea)
      );

      expect(textarea.instance().needsPlaceholding).toBeFalsy();
    });
  });

  describe('after componentWillReceiveProps', () => {
    test('should not needsPlaceholding', () => {
      const textarea = shallow(
        React.createElement(Textarea, { placeholder: "placeholder" })
      );

      textarea.setProps({ placeholder: '' });

      expect(textarea.instance().needsPlaceholding).toBeFalsy();
    });
  });

  describe('after componentDidUpdate', () => {
    test('setSelectionIfNeeded be called', () => {
      const textarea = shallow(
        React.createElement(Textarea, { placeholder: "placeholder" })
      );
      const instance = textarea.instance();
      const fakeSetSelection = jest.spyOn(instance, 'setSelectionIfNeeded');

      instance.componentDidUpdate();

      expect(fakeSetSelection).toHaveBeenCalled();
    });
  });

  describe('onFocus', () => {
    const onFocus = jest.fn();
    const textarea = shallow(
      React.createElement(Textarea, { placeholder: "placeholder", onFocus })
    );

    test('hasFocus changed', () => {
      const instance = textarea.instance();
      expect(instance.hasFocus).toBeFalsy();

      instance.onFocus(FAKE_EVENT);
      expect(instance.hasFocus).toBeTruthy();
    });

    test('setSelectionIfNeeded be called', () => {
      const instance = textarea.instance();
      const fakeSetSelection = jest.spyOn(instance, 'setSelectionIfNeeded');

      instance.onFocus(FAKE_EVENT);

      expect(fakeSetSelection).toHaveBeenCalled();
    });

    test('onFocus from props called', () => {
      textarea.instance().onFocus(FAKE_EVENT);

      expect(onFocus).toHaveBeenCalled();
    });
  });

  describe('onBlur', () => {
    const onBlur = jest.fn();
    const textarea = shallow(
      React.createElement(Textarea, { placeholder: "placeholder", onBlur })
    );

    test('hasFocus changed', () => {
      const instance = textarea.instance();

      instance.hasFocus = true;

      instance.onBlur(FAKE_EVENT);
      expect(instance.hasFocus).toBeFalsy();
    });

    test('onBlur from props called', () => {
      textarea.instance().onBlur(FAKE_EVENT);

      expect(onBlur).toHaveBeenCalled();
    });
  });

  describe('setSelectionIfNeeded', () => {
    let textarea;
    beforeEach(() => {
      textarea = shallow(
        React.createElement(Textarea, { placeholder: "placeholder" })
      );
    });

    test('return true', () => {
      const node = {
        selectionStart: 1,
        selectionEnd: 0,
        setSelectionRange: jest.fn()
      };
      const instance = textarea.instance();
      instance.needsPlaceholding = true;
      instance.hasFocus = true;
      instance.needsPlaceholding = true;

      expect(instance.setSelectionIfNeeded(node)).toBeTruthy();
      expect(node.setSelectionRange).toBeCalled();
    });

    test('return false', () => {
      const node = {
        setSelectionRange: jest.fn()
      };

      expect(textarea.instance().setSelectionIfNeeded(node)).toBeFalsy();
      expect(node.setSelectionRange).not.toBeCalled();
    });
  });

  describe('onChange', () => {
    test('onChange from props be called', () => {
      const onChange = jest.fn();
      const textarea = shallow(
        React.createElement(Textarea, { placeholder: "placeholder", onChange })
      );

      textarea.instance().onChange(FAKE_EVENT);

      expect(onChange).toHaveBeenCalled();
    });

    test('remove placeholder when text is added', () => {
      const textarea = shallow(
        React.createElement(Textarea, { placeholder: "placeholder" })
      );
      const fakeEvent = { target: { value: '5placeholder' } };

      const instance = textarea.instance();
      instance.isPlaceholding = true;
      instance.onChange(fakeEvent);

      expect(fakeEvent.target.value).toEqual('5');

    });
  });

  describe('onSelect', () => {
    test('setSelectionIfNeeded called', () => {
      const textarea = shallow(
        React.createElement(Textarea, { placeholder: "placeholder" })
      );
      const instance = textarea.instance();
      const fakeSetSelection = jest.spyOn(instance, 'setSelectionIfNeeded');

      expect(instance.onSelect(FAKE_EVENT)).toBeFalsy();
      expect(fakeSetSelection).toHaveBeenCalled();
    });

    test('onSelect from props called', () => {
      const onSelect = jest.fn();
      const textarea = shallow(
        React.createElement(Textarea, { placeholder: "placeholder", onSelect })
      );
      const instance = textarea.instance();
      instance.isPlaceholding = false;
      instance.onSelect(FAKE_EVENT);

      expect(onSelect).toHaveBeenCalled();
    });
  });
});