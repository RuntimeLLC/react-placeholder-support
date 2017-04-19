import React from 'react';
import ReactPlaceholderSupport from '../src/react-placeholder-support';
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';

const createElement = document.createElement;
const spy = jest.fn((inp) => {
  if (inp === 'input') {
    return {};
  }

  return createElement(inp);
});
document.createElement = spy;
const Textarea = ReactPlaceholderSupport('textarea');

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
      const Textarea = ReactPlaceholderSupport('textarea');

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
  })

  describe('after componentDidUpdate', () => {
    test('setSelectionIfNeeded be called', () => {
      const textarea = shallow(
        React.createElement(Textarea, { placeholder: "placeholder" })
      );
      const fakeSetSelection = jest.spyOn(textarea.instance(), 'setSelectionIfNeeded')

      textarea.instance().componentDidUpdate();

      expect(fakeSetSelection).toHaveBeenCalled();
    });
  });

  describe('onFocus', () => {
    test('hasFocus changed', () => {
      const textarea = shallow(
        React.createElement(Textarea, { placeholder: "placeholder" })
      );
      expect(textarea.instance().hasFocus).toBeFalsy();

      textarea.instance().onFocus({ target: 'something' });
      expect(textarea.instance().hasFocus).toBeTruthy();
    });

    test('setSelectionIfNeeded be called', () => {
      const textarea = shallow(
        React.createElement(Textarea, { placeholder: "placeholder" })
      );
      const fakeSetSelection = jest.spyOn(textarea.instance(), 'setSelectionIfNeeded')

      textarea.instance().onFocus({ target: 'something' });

      expect(fakeSetSelection).toHaveBeenCalled();
    });

    test('onFocus from props called', () => {
      const onFocus = jest.fn();
      const textarea = shallow(
        React.createElement(Textarea, { placeholder: "placeholder", onFocus })
      );

      textarea.instance().onFocus({ target: 'something' });

      expect(onFocus).toHaveBeenCalled();
    });
  });

  describe('onBlur', () => {
    test('hasFocus changed', () => {
      const textarea = shallow(
        React.createElement(Textarea, { placeholder: "placeholder" })
      );
      textarea.instance().hasFocus = true;

      textarea.instance().onBlur({ target: 'something' });
      expect(textarea.instance().hasFocus).toBeFalsy();
    });

    test('onBlur from props called', () => {
      const onBlur = jest.fn();
      const textarea = shallow(
        React.createElement(Textarea, { placeholder: "placeholder", onBlur })
      );

      textarea.instance().onBlur({ target: 'something' });

      expect(onBlur).toHaveBeenCalled();
    });
  });

  describe('setSelectionIfNeeded', () => {
    test('return true', () => {
      const textarea = shallow(
        React.createElement(Textarea, { placeholder: "placeholder" })
      );
      const node = {
        selectionStart: 1,
        selectionEnd: 0,
        setSelectionRange: jest.fn()
      };
      textarea.instance().needsPlaceholding = true;
      textarea.instance().hasFocus = true;
      textarea.instance().needsPlaceholding = true;
      expect(textarea.instance().setSelectionIfNeeded(node)).toBeTruthy();
      expect(node.setSelectionRange).toBeCalled();
    });

    test('return false', () => {
      const textarea = shallow(
        React.createElement(Textarea, { placeholder: "placeholder" })
      );
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

      textarea.instance().onChange({ target: { value: '' } });

      expect(onChange).toHaveBeenCalled();
    });

    test('remove placeholder when text is added', () => {
      const textarea = shallow(
        React.createElement(Textarea, { placeholder: "placeholder" })
      );
      const fakeEvent = { target: { value: '5placeholder' } };

      textarea.instance().isPlaceholding = true;
      textarea.instance().onChange(fakeEvent);

      expect(fakeEvent.target.value).toEqual('5');

    });
  });

  describe('onSelect', () => {
    test('setSelectionIfNeeded called', () => {
      const textarea = shallow(
        React.createElement(Textarea, { placeholder: "placeholder" })
      );
      const fakeSetSelection = jest.spyOn(textarea.instance(), 'setSelectionIfNeeded')

      expect(textarea.instance().onSelect({ target: 'something' })).toBeFalsy();
      expect(fakeSetSelection).toHaveBeenCalled();
    })

    test('onSelect from props called', () => {
      const onSelect = jest.fn();
      const textarea = shallow(
        React.createElement(Textarea, { placeholder: "placeholder", onSelect })
      );
      textarea.instance().isPlaceholding = false;
      textarea.instance().onSelect({ target: 'something' })

      expect(onSelect).toHaveBeenCalled();
    })
  });
});