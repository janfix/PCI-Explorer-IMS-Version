/*
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2017 (original work) Open Assessment Technologies SA;
 *
 */
define([
    'qtiCustomInteractionContext',
    'exploPCI/interaction/runtime/js/lib/datatables', // Contains and extends JQuery
    'exploPCI/interaction/runtime/js/renderer',
    'taoQtiItem/portableLib/OAT/util/event'
], function(qtiCustomInteractionContext, $, renderer, event) {
    'use strict';

    var _typeIdentifier = 'exploPCI';



    var exploInteraction = {

        /*********************************
         *
         * IMS specific PCI API property and methods
         *
         *********************************/

        typeIdentifier: _typeIdentifier,

        /**
         * initialize the PCI object. As this object is cloned for each instance, using "this" is safe practice.
         * @param {DOMELement} dom - the dom element the PCI can use
         * @param {Object} config - the sandard configuration object
         * @param {Object} [state] - the json serialized state object, returned by previous call to getStatus(), use to initialize an
         */
        getInstance: function getInstance(dom, config, state) {
            var response = config.boundTo;
            console.log(response)

            /*  this.$ = $;
             console.log(this.$)
             this.$(".explo").hide()
             window.$ = ""; */

            console.log(config)

            //simply mapped to existing TAO PCI API
            this.initialize(Object.getOwnPropertyNames(response).pop(), dom, config.properties, config.assetManager);
            this.setSerializedState(state);

            //tell the rendering engine that I am ready
            if (typeof config.onready === 'function') {
                config.onready(this, this.getState());
            }
        },

        /**
         * Get the current state fo the PCI
         * @returns {Object}
         */
        getState: function getState() {
            //simply mapped to existing TAO PCI API
            return this.getSerializedState();
        },

        /**
         * Called by delivery engine when PCI is fully completed
         */
        oncompleted: function oncompleted() {
            this.destroy();
        },

        /*********************************
         *
         * TAO and IMS shared PCI API methods
         *
         *********************************/

        /**
         * Get the response in the json format described in
         * http://www.imsglobal.org/assessment/pciv1p0cf/imsPCIv1p0cf.html#_Toc353965343
         *
         * @param {Object} interaction
         * @returns {Object}
         */
        getResponse: function() {
            console.log(this.dom)
                        
            // Prouve independance des traitements : value = "REPONSES" + " " + $container.find(".explo").attr("data-id") ;
            //Donc le cumul des datas à lieu dans les variables ????
            //'{"FolderTree" : ' + $container.find('.dataTree').html()+'}' ;
            var $container = $(this.dom),
                value = 
               '{"FolderTree" : ' + $container.find('.dataTree').html() +
                ',"FileList" : ' + $container.find('.dataFiles').html() +
                ',"ClipBoard" : ' + $container.find('.dataClipBoard').html() +
                ',"Actions" : [' + $container.find('.dataActions').html() + ']}'; 

            return { base: { string: value } };
        },
        /**
         * Reverse operation performed by render()
         * After this function is executed, only the inital naked markup remains
         * Event listeners are removed and the state and the response are reset
         *
         * @param {Object} interaction
         */
        destroy: function() {

            var $container = $(this.dom);
            $container.off().empty();
            var $fileList = $container.find('.dirContent').DataTable().destroy();



        },


        /*********************************
         *
         * TAO specific PCI API methods
         *
         *********************************/

        /**
         * Get the type identifier of a pci
         * @returns {string}
         */
        getTypeIdentifier: function() {
            return _typeIdentifier;
        },

        /**
         * Render the PCI :
         * @param {String} id
         * @param {Node} dom
         * @param {Object} config - json
         */
        initialize: function(id, dom, config, assetManager) {

            //add method on(), off() and trigger() to the current object
            event.addEventMgr(this);

            this.dom = dom;
            this.config = config || {};
            var self = this;
            var uniqTable = "UT" + Date.now();
            $(dom).find(".dirContent").addClass(uniqTable).attr("data-id", uniqTable)
            $(dom).find(".data").html('<button class="dataGrabber">dataFolders</button><div class="dataTree">"No changes"</div><div class="dataFiles">"No Changes" </div><div class="dataClipBoard">"No changes"</div><div class="dataActions">"No action"</div>');

            renderer.render(id, this.dom, this.config, assetManager);

            this.on('jsonImporterChange', function(jsonData) {
                // Importator function 
                self.config.data = jsonData;
                renderer.render(self.id, self.dom, self.config, assetManager);
            });

            this.on('saveStateChange', function() {
                console.log("Still saving from entrypoint")
                var value = {}
                $(self.dom).find(".dataGrabber").trigger("click");
                value.mapFile = JSON.parse($(self.dom).find(".dataFiles").html());
                value.treeFolder = JSON.parse($(self.dom).find(".dataTree").html());
                //value = JSON.stringify(value);
                self.trigger('scriptSaverChange', [value]);
                // renderer.render(self.id, self.dom, self.config, assetManager);
            });



        },

        /**
         * Programmatically set the response following the json schema described in
         * http://www.imsglobal.org/assessment/pciv1p0cf/imsPCIv1p0cf.html#_Toc353965343
         *
         * @param {Object} interaction
         * @param {Object} response
         */
        setResponse: function(response) {

            var $container = $(this.dom),
                value = response && response.base ? parseInt(response.base.integer) : -1;

            $container.find('input[value="' + value + '"]').prop('checked', true);
        },

        /**
         * Remove the current response set in the interaction
         * The state may not be restored at this point.
         *
         * @param {Object} interaction
         */
        resetResponse: function() {

            var $container = $(this.dom);

            $container.find('input').prop('checked', false);// ??????????????????
        },

        /**
         * Restore the state of the interaction from the serializedState.
         *
         * @param {Object} interaction
         * @param {Object} serializedState - json format
         */
        setSerializedState: function(state) {
            if (state && state.response) {
                this.setResponse(state.response);
            }
        },

        /**
         * Get the current state of the interaction as a string.
         * It enables saving the state for later usage.
         *
         * @param {Object} interaction
         * @returns {Object} json format
         */
        getSerializedState: function() {
            return { response: this.getResponse() };
        }
    };



    qtiCustomInteractionContext.register(exploInteraction);

    return exploInteraction;
});