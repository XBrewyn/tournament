class Tool {
  static path = {
    CSS: './css/',
    JS: './js/'
  };

  static range(range) {
    return [...Array(range).keys()];
  }

  static createEl({ tag, target, attrs = {} }) {
    const el = document.createElement(tag);

    Object.entries(attrs)
      .forEach(([attr, value]) => el[attr] = value);

    document.querySelector(target).appendChild(el);

    return el;
  };

  static createTemplate({ template, target = '#app' }) {
    document.querySelector(target).innerHTML = template;
  };

  static selector(className) {
    return document.querySelector(`.${Interface.CLASS_NAME}__${className}`);
  }

  static selectorAll(className) {
    return document.querySelectorAll(`.${Interface.CLASS_NAME}__${className}`);
  }

  static map(elements, callback) {
    return elements.map((element, index) => callback(element, index)).join('');
  };

  static sortRandom(elements) {
    return elements.sort(() => .5 - Math.random());
  };

  static capitalize(str) {
    return str.replace(/./,(str)=> str.toUpperCase());
  }
}
