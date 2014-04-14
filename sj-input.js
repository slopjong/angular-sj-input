'use strict';

/* QUICK AND DIRTY IMPLEMENTATION WITH UNPROPER SCOPING */

// Original jQuery code by James Padolsey
// Ported to AngularJS by Romain Schmitz
// Directive based on http://stackoverflow.com/a/931695
angular
  .module("sj.input", [])
  .directive("sjInput", function($compile) {
    return {
      restrict: 'EA',
      template: '<input type="text" ng-model="text">',
      replace: true,
      link: function(scope, element, attributes) {

        // default settings
        scope.config = {
          maxWidth: 1000,
          minWidth: 0,
          comfortZone: 25
        };

        scope.text = "";

        function computed(element) {
          // get the element's computed style
          return element[0].currentStyle ||
            window.getComputedStyle(element[0]);
        }

        var style = computed(element);
        var minWidth = scope.config.minWidth || parseInt(style.width);

        // create a new test element with the same style as the input element
        scope.testSubject = $compile('<sj-input-tester></je-input-tester>')(scope);
        scope.testSubject.css({
          position: 'absolute',
          top: -9999 + 'px',
          left: -9999 + 'px',
          width: 'auto',
          fontSize: style.fontSize,
          fontFamily: style.fontFamily,
          fontWeight: style.fontWeight,
          letterSpacing: style.letterSpacing,
          whiteSpace: 'nowrap'
        });

        var check = function() {

          // escape the text to avoid wrong rendering because of wrong
          // browser encoding settings
          var escaped = scope.text
            .replace(/&/g, '&amp;')
            .replace(/\s/g,'&nbsp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

          scope.testSubject.html(escaped);

          // Calculate new width + whether to change
          var testerWidth = parseInt(computed(scope.testSubject).width);

          var newWidth;

          if ( (testerWidth + scope.config.comfortZone) >= minWidth) {
            newWidth = testerWidth + scope.config.comfortZone;
          } else {
            newWidth = minWidth;
          }

          var currentWidth = parseInt(computed(element).width);

          var isValidWidthChange = (newWidth < currentWidth && newWidth >= minWidth) ||
            (newWidth > minWidth && newWidth < scope.config.maxWidth);

          if (isValidWidthChange) {
            element.css('width', newWidth + 'px');
          }
        };

        element.after(scope.testSubject);

        element.on('keyup keydown blur update', function() {
          check();
        });
      }
    };
  });
