const test = Tool.test();

test('it should return the correct path for static folders')
  .expected(Tool.path)
  .equalObject({
    CSS: './css/',
    JS: './js/'
  });

test('it should return an array of 0 to 4')
  .expected(Tool.range(5))
  .equalObject([0, 1, 2, 3, 4]);

test('it should return a length of 5')
  .expected(Tool.range(5).length)
  .equalObject(5);

(() => {
  const CLASS_NAME = `${Interface.CLASS_NAME}__test`;
  const el = Tool.createEl({
    tag: 'div',
    target: 'body',
    attrs: {
      className: CLASS_NAME
    } 
  });

  Tool.createTemplate({
    target: 'body',
    template: `<div class="${CLASS_NAME}">hello this is a test</div>`
  });

  const expectedEl = document.querySelector(`.${CLASS_NAME}`);
  const expectedTemplate = document.querySelectorAll(`.${CLASS_NAME}`)[1];

  test('it should create an element')
    .expected(el)
    .equalObject(expectedEl);

  test('it should have a className')
    .expected(expectedEl.className)
    .equalObject(CLASS_NAME);

  test('it should be a div tag')
    .expected(el.tagName)
    .equalObject('DIV');

  test('it should select an element')
    .expected(Tool.selector('test'))
    .equalObject(expectedEl);

  test('it should select an array element')
    .expected(Tool.selectorAll('test'))
    .equalObject(document.querySelectorAll(`.${CLASS_NAME}`));

  test('it should create an template')
    .expected(`<div class="${CLASS_NAME}">hello this is a test</div>`)
    .equal(expectedTemplate.outerHTML);

  el.remove();
  expectedTemplate.remove();
})();

test().notify();
