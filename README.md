jQuery.DOMDataSource
====================

Just a simple interface for getting data from the DOM into Javascript.

Usage
-----

To retrieve semantic data stored in the DOM, pass a hash of accepted attributes to `$.DOMDataSource`:

    <div class="car">
      <span class="color">yellow</span>
      <span class="make">dodge</span>
      <span class="model">dart</span>
    </div>

    jQuery(document).ready(function ($) {

      var attributes = {
        color: '',
        make: '',
        model: ''
      };

      var car = $('.car').DOMDataSource(attributes);
    });

Collections of data can also be retrieved from lists:

    <ul>
      <li>
        <span class="color">blue</span>
        <span class="make">amc</span>
        <span class="model">hornet</span>
      </li>
      <li>
        <span class="color">orange</span>
        <span class="make">chevrolet</span>
        <span class="model">corvair</span>
      </li>
    </ul>

    // in script:
    var cars = $('ul').DOMDataSource(attributes);

Finally, data may also be sourced from tables. Note that tables will try and convert the column headers into attribute keys.

    <table>
      <thead>
        <tr>
          <th>Color</th>
          <th>Make</th>
          <th>Model</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>green</td>
          <td>oldsmobile</td>
          <td>woodie</td>
        </tr>
        <tr>
          <td>silver</td>
          <td>dmc</td>
          <td>delorean</td>
        </tr>
      </tbody>
    </table>

    // in script:
    var cars = $('table').DOMDataSource(attributes);

Author
------

RJ Zaworski <rj@rjzaworski.com>

License
-------

JSON License
