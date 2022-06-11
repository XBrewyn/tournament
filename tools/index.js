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
    document.querySelector(target).innerHTML += template;
  };

  static selector(className) {
    return document.querySelector(`.${Interface.CLASS_NAME}__${className}`);
  }

  static selectorAll(className) {
    return document.querySelectorAll(`.${Interface.CLASS_NAME}__${className}`);
  }

  static test() {
    const tests = [];

    return (message = '') => {
      return {
        notify: () => console.table(tests),
        expected: (expect) => {
          const passed = { Message: message, passed: '✓'};
          const notPassed = { Message: message, passed: 'x'};

          return {
            equal(value) {
              tests.push((expect === value) ? passed : notPassed)
            },

            equalObject(value) {
              tests.push((JSON.stringify(expect) === JSON.stringify(value)) ? passed : notPassed)
            }
          }
        }
      }
    }
  }
};

Array.prototype.sortRandom = function () {
  return this.sort(() => .5 - Math.random());
};

Array.prototype.template = function(callback) {
  return this.map((element, index) => callback(element, index)).join('');
};

String.prototype.capitalize = function () {
  return this.replace(/./,(str)=> str.toUpperCase());
};
