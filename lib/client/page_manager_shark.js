
// the simplest possible implementation (no error checking)

var regions  = new ReactiveDict;
var settings = new ReactiveDict;

var renderTemplate = function (name, data) {
  var template = Template[name];
  if (template)
    return template;
  return UI.Component.extend({
    render: function () {
      return HTML.P({}, "Template '" + name + "' does not exist.");
    }
  });
}

PageManager = {
  setTemplate: function (template, to) {
    if (to === undefined)
      settings.set('default', template);
    else
      regions.set(to, template);
  },
  setLayout: function (layout) {
    settings.set('layout', layout);
  },
  setData: function (data) {
    settings.set('data', data);
  },
  getData: function () {
    settings.get('data');
  },
  renderRegion: function (regionName) {
    var templateName = "";
    if (_.isString(regionName)) {
      templateName = regions.get(regionName);
    } else {
      templateName = settings.get('default');
    }
    return renderTemplate(templateName);
  },
  renderLayout: function () {
    var templateName = settings.get('layout');
    return renderTemplate(templateName).extend({
      data: settings.get('data')
    });
  },
  clearUnusedYields: function () {
    // TODO: implement this
    // TODO: without this, the wait API won't work :/
  },
}
