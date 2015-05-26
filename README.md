# command-queue

Collect commands for a plugin and runs them after downloading the plugin.
Plugin's method set as first argument. Others arguments are passed to the method.

Made by analogy with [google universal analitycs plugin](https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced).
It will be useful for analysts and other plugins that are loaded asynchronously

## Install with [bower](bower.io)

```sh
bower install command-queue
```

Global
```html
<script src="bower_components/command-queue.min.js"></script>
```
```js
var CommandQueue = window.CommandQueue
```

AMD
```js
define(['bower_components/command-queue'], function(CommandQueue) { ... })
```

##Usage
```js
var qc = CommandQueue();

$http.get('plugin/url')
  .then(function(plugin) {
    qc.init(plugin);
  });

qc('send', '/test', data) //equivalent to `plugin.send('/test', data)`
```

or use plugin id (and plugin getter)
```js
var qc = CommandQueue();
var plugins = {};

Promise.all($http.get('plugin1/url'), $http.get('plugin2/url'))
  .then(function(plugin1, plugin2) {
    plugins[plugin1.id] = plugin1; //f.e. id = 1234
    plugins[plugin2.id] = plugin2;

    qc.initGetter(function(pluginId) {
      return plugins[pluginId];
    });
})

qc('send:1234', '/test', data) //equivalent to `plugins[1234].send('/test', data)`
```

##Class API
### CommandQueue([params])
Set `params.copy = copyFn` if you need a custom method to copy arguments

Return `commandQueue` instance

##Instance API
### commandQueue.init(plugin)
Set plugin

### commandQueue.initGetter(getter)
Set getter that take plugin id and return plugin