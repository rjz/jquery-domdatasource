/**
 *	$.fn.DOMDataSource
 *
 *	Retrieves JS objects from common DOM data formats
 *
 *	@author	RJ Zaworski <rj@rjzaworski.com>
 *	@license	JSON
 *	@usage
 *
 *		var attributes = {
 *			color: '',
 *			make: '',
 *			model: ''
 *		};
 *
 *		instance = $('div').DOMDataSource(attributes, {type: 'element'});
 *		instance = $('div.vcard').DOMDataSource(attributes);
 *		instance = $('ul').DOMDataSource(attributes);
 *		instance = $('table').DOMDataSource(attributes);
 */
(function ($) {

 	/**
	 *	Call an adapter on the specified element
	 *
	 *	@private
	 *	@param	{jQuery|DOMNode|String}	subject	element to draw data from
	 *	@param	{Object}	whitelist	contains default key/value map of data attributes
	 *	@param	{Object=}	opts	list of options
	 */
	var _callAdapter = function(subject, whitelist, opts) {

		var $subject = $(subject),
			adapter,
			options = $.extend({}, opts);

		adapter = adapters[options.type]

		if (!(adapter instanceof Function)) return null;

		return adapter.call($subject, whitelist, options);
	}

	var adapters = {

		/**
		 *	Adapt data described by the `data-*` attributes into an attribute hash
		 *
		 *	@param	{Object}	whitelist	contains default key/value map of data attributes
		 *	@return	{Object}
		 */
		element: function (whitelist) {

			var result = $.extend({}, whitelist),
				self = this;

			$.each(whitelist, function(k, v) {
				result[k] = self.data(k);
			});

			return result;
		},

		/**
		 *	Adapt data contained in nested DOM elements into an attribute hash
		 *
		 *	Options include:
		 *	- `attribute` to draw data key from (default: "class")
		 *
		 *	@param	{Object}	whitelist	contains default key/value map of data attributes
		 *	@param	{Object=}	opts	list of options
		 *	@return	{Object}
		 */
		children: function (whitelist, opts) {

			var options = $.extend({attribute: 'class'}, opts),
				result = $.extend({}, whitelist),
				self = this;

			$.each(whitelist, function(k, v) {
				result[k] = self.find('[' + options.attribute + '~=' + k + ']').text();
			});

			return result;
		},

		/**
		 *	Adapter for pulling data from an arbitrary list
		 *
		 *	Options include:
		 *	- `format` of adapter to be used for each `<li>` (default: 'children')
		 *
		 *	@param	{Object}	whitelist	contains default key/value map of data attributes
		 *	@param	{Object=}	opts	list of options
		 *	@return	{Array}
		 */
		list: function (whitelist, opts) {
	
			var options = $.extend({ format: 'children' }, opts),
				result = [],
				self = this;

			this.find('li').each(function () {
				result.push(_callAdapter(this, whitelist, { type: options.format }));
			});

			return result;
		},

		/**
		 *	Adapter for pulling data from a vertical data table.
		 *	
		 *	Options include
		 *	- `map` of column headings to `whitelist` keys
		 *
		 *	@param	{Object}	whitelist	contains default key/value map of data attributes
		 *	@param	{Object=}	opts	list of options
		 *	@return	{Array}
		 */
		table: function (whitelist, opts) {
	
			var options = $.extend({ 
					format: 'children',
					map: []
				}, opts),
				result = [],
				self = this;

			if (!options.map.length) {

				// attempt to detect map+scope by table headers
				this.find('th').each(function () {
					options.map.push(this.innerText.toLowerCase());
				});
			}

			$('tr').each(function() {

				var err = false,
					item = {},
					self = $(this);

				// try and create item based on the column map. If an index can't be
				// found, `err` will be set and no item will be created
				$.each(options.map, function(k, v) {
					var cell = self.find('td:nth-child(' + (k + 1) + ')');
					if (!cell.length) return !(err = true);
					item[v] = cell.text();
				});

				if (!err) result.push(item);
			});

			return result;
		}
	}

	/**
	 *	A plugin! My kingdom for a plugin!
	 *
	 *	Options include:
	 *	- `type` of adapter to use ('auto','element','children','list','table', default='auto')
	 *	- `format` of adapter for nested elements (type='list' only)
	 *
	 *	@param	{Object}	whitelist	contains default key/value map of data attributes
	 *	@param	{Object=}	opts	list of options
	 *	@return	{Object|Array}
	 */
	$.fn.DOMDataSource = function (whitelist, opts) {

		var $el = $(this).first(),
			options = { type: 'auto' };

		if (options.type == 'auto') {
			if ($el.is('table')) {
				options.type = 'table';
			} else if ($el.is('ul, ol, dl')) {
				options.type = 'list';
			} else {
				options.type = 'children';
			}
		}

		$.extend(options, opts);

		return _callAdapter($el, whitelist, options);
	}

})(jQuery);
