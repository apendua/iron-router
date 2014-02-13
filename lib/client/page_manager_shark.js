
// the simplest possible implementation (no error checking)

var yieldsToTemplates = new ReactiveDict;
var settings = new ReactiveDict;

var renderTemplate = function (name, data) {
  var template = Template[name];
  if (template) {
    return template;
  }
  return UI.Component.extend({
    render: function () {
      return HTML.P({}, "Template '" + name + "' does not exist.");
    }
  });
}

PageManager = {
  setTemplate: function (template, to) {
    if (to === undefined)
      to = '__main__';
    yieldsToTemplates.set(to, template);
    //console.log('set', template, 'for', to);
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
  renderRegion: function (name) {
    var templateName = "";
    if (!_.isString(name))
      name = '__main__';
    templateName = yieldsToTemplates.get(name);
    if (!templateName) { // unused yield
      return UI.Component;
    }
    return renderTemplate(templateName);
  },
  renderLayout: function () {
    var templateName = settings.get('layout');

    if (!_.isString(templateName)) {
      return Template.__defaultLayout__.extend({
        data: settings.get('data') // maybe return funcion (?)
      });
    }

    return renderTemplate(templateName).extend({
      data: settings.get('data')
    });
  },
  clearYield: function (name) {
    yieldsToTemplates.set(name, null);
  },
  clearUnusedYields: function (usedYields) {
    // XXX without this, the wait API won't work :/

    var self = this;
    var allYields = _.keys(yieldsToTemplates.keys);

    // XXX why is this necessary (?)
    usedYields = _.filter(usedYields, function (name) { return !!name; });

    var unusedYields = _.difference(allYields, usedYields);

    _.each(unusedYields, function (name) {
      PageManager.clearYield(name);
    });
  },
}
