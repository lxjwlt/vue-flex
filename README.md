# vue-flex

`vue-flex` is a vue component which provide `flexbox` features, automatically fix cross-browser bugs mentioned in [Flexbugs](https://github.com/philipwalton/flexbugs), and works in **IE10+** and modern browser.

## Installation

```
npm install @lxjwlt/vue-flex -D
```

Install `vue-flex` on Vue:

```javascript
Vue.use(require('@lxjwlt/vue-flex'));
```

## Usage

`vue-flex` provides `<flex>` and `<flex-item>` components, and their props is same as css properties of `flexbox`:

```html
<flex flex-direction="row">
    <flex-item flex="1">...</flex-item>
</flex>
```

The props of `<flex>` component: `flex-direction`, `flex-wrap`, `justify-content`, `align-items`, `align-content`.

The props of `<flex-item>` component: `flex`, `order`, `align-self`.


