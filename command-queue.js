/**
 * Collect commands for a plugin and runs them after downloading the plugin.
 * Plugin's method set as first argument. Others arguments are passed to the method.
 *
 * ```
 *   var qc = CommandQueue();
 *
 *   $http.get('plugin/url')
 *     .then(function(plugin) {
 *       qc.init(plugin);
 *     });
 *
 *   qc('send', '/test', data) //equivalent to `plugin.send('/test', data)`
 * ```
 *
 * or use plugin id (and plugin getter)
 * ```
 *   var qc = CommandQueue();
 *   var plugins = {};
 *
 *   Promise.all($http.get('plugin1/url'), $http.get('plugin2/url'))
 *     .then(function(plugin1, plugin2) {
 *       plugins[plugin1.id] = plugin1; //f.e. id = 1234
 *       plugins[plugin2.id] = plugin2;
 *
 *       qc.initGetter(function(pluginId) {
 *         return plugins[pluginId];
 *       });
 *   })

 *   qc('send:1234', '/test', data) //equivalent to `plugins[1234].send('/test', data)`
 * ```
 *
 * Class options
 * @param {Object}    params
 * @param {Function}    params.copy - custom method to copy arguments
 *
 * @return {Function} command queue instance
 *
 * Instance options
 * @param {Function} init - initialize plugin
 *   - plugin {Object or Function} - plugin
 * @param {Function} initGetter - initialize plugin getter
 *   - getter {Function} - getter that take plugin id and return plugin
 */

(function(root) {
    if (typeof define == 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(function() {
            return CommandQueue;
        });
    }
    root.CommandQueue = CommandQueue;

    function CommandQueue(params) {
        params = params || {};

        function commandQueue(command) {
            var queue  = commandQueue.q = commandQueue.q || [];
            var plugin = commandQueue.p;
            var getter = commandQueue.g;
            var args;

            if (command) {
                args = Array.prototype.slice.call(arguments); //convert arguments to Array

                //you can copy arguments by custom method for save context
                queue.push(params.copy ? params.copy(args) : args);
            }

            if (plugin || getter) {
                for (var i = 0;  i < queue.length; i++) {
                    args = queue[i];

                    //command can be in the format `commandName:pluginId`
                    command = args[0].split(':');

                    args[0] = command[0];

                    //get plugin if the plugin getter specified and run plugin's method with it's arguments
                    (plugin || getter(command[1]))[args.shift()].apply(null, args);
                }
                queue.length = 0;
            }
        }

        commandQueue.init = function(plugin) {
            commandQueue.p = plugin; //set plugin
            commandQueue();
        };

        commandQueue.initGetter = function(getter) {
            commandQueue.g = getter; //set plugin getter
            commandQueue();
        };

        return commandQueue;
    }
})(window);