React ie9 placeholder support
=============================

## Install

```js
npm install react-placeholder-support
```

OR

```js
yarn add react-placeholder-support
```

## Usage

```js
import ReactPlaceholderSupport from 'react-placeholder-support';

Input = ReactPlaceholderSupport('input')
Textarea = ReactPlaceholderSupport('textarea')
```

```html
<Input placeholder="input" value={this.state.value} onChange={this.handleChange} />
<Textarea placeholder="input" value={this.state.value} onChange={this.handleChange} />
```
