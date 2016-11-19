
import Component from 'can-component';
import DefineMap from 'can-define/map/map';
import template from './print.stache!';

import 'spectre-canjs/nav-container/';

/**
 * @constructor print-widget.ViewModel ViewModel
 * @parent print-widget
 * @group print-widget.ViewModel.props Properties
 *
 * @description A `<print-widget />` component's ViewModel
 */
export const ViewModel = DefineMap.extend({
  /**
   * @prototype
   */
    /**
     * @property {String} print-widget.ViewModel.mapTitle mapTitle
     * @parent print-widget.ViewModel.props
     *
     * The default map title to send to the print service.
     */
    mapTitle: {
        type: 'string',
        value: 'Map Print'
    },
    /**
     * The default layout to select from the print widget
     * @property {String}  print-widget.ViewModel.selectedLayout selectedLayout
     * @parent print-widget.ViewModel.props
     */
    selectedLayout: {
        type: 'string',
        value: null
    },
    /**
     * The default dpi to select from the print widget
     * @property {Number}  print-widget.ViewModel.selectedDpi selectedDpi
     * @parent print-widget.ViewModel.props
     */
    selectedDpi: {
        type: 'number',
        value: null
    },
    /**
     * The current list of print results in the widget
     * @property {Array<guides.types.PrintResult>} print-widget.ViewModel.printResults printResults
     * @parent print-widget.ViewModel.props
     */
    printResults: {
        value: []
    },
    /**
     * The print provider to use for printing
     * @property {providers.printProvider} print-widget.ViewModel.provider provider
     * @parent print-widget.ViewModel.props
     */
    provider: {
        value: null
    },
    /**
     * The print provider to use for printing
     * @property {Promise} print-widget.ViewModel.provider provider
     * @parent print-widget.ViewModel.props
     */
    printOptionsPromise: {
        get (lastSetValue, setAttr) {
            if (this.provider) {
                return this.provider.getCapabilities();
            }
        }
    },
    /**
     * The available print options like size, dpi, etc
     * @property {Object} print-widget.ViewModel.provider provider
     * @parent print-widget.ViewModel.props
     */
    printOptions: {
        get (val, set) {
            if (this.printOptionsPromise) {
                this.printOptionsPromise.then(set);
            } else {
                return null;
            }
        }
    },
    /**
     * a map object that will pair with a print provider to provide a printed map
     * @property {Any} print-widget.ViewModel.provider provider
     * @parent print-widget.ViewModel.props
     */
    map: '*',
  /**
   * @function printButtonClick
   * Called when the print button is clicked to activate the provider's `print` method.
   */
    printButtonClick () {
        if (!this.map) {
            console.error('Print: Map is not set');
        }
        if (this.provider && !this.printing) {
            this.printing = true;
            this.provider.print({
                map: this.map,
                layout: this.selectedLayout,
                dpi: this.selectedDpi,
                title: this.mapTitle
            }).then(this.handlePrintout.bind(this));
        }
    },
  /**
   * @function clearButtonClick
   * Click handler for when the clear button is clicked. Empties out the current list of `printResults`
   * @return {[type]} [description]
   */
    clearButtonClick () {
        this.printResults.replace([]);
    },
  /**
   * @function handlePrintout
   * Hanlder for when the print deferred returned by the provider resolves to update add the print result to the list of results
   * @param  {PrintResult} results The result of the printout
   */
    handlePrintout: function (results) {
        this.printing = false;
        this.printResults.push(results);
    }
});

export default Component.extend({
    tag: 'print-widget',
    viewModel: ViewModel,
    template: template
});
