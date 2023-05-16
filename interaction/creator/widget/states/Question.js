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
 * Copyright (c) 2016 (original work) Open Assessment Technologies SA;
 *
 */
define([
    'exploPCI/interaction/runtime/js/lib/datatables',
    'taoQtiItem/qtiCreator/widgets/states/factory',
    'taoQtiItem/qtiCreator/widgets/interactions/states/Question',
    'taoQtiItem/qtiCreator/widgets/helpers/formElement',
    'tpl!exploPCI/interaction/creator/tpl/propertiesForm',
    'lodash'
], function($, stateFactory, Question, formElement, formTpl, _) {
    'use strict';

    var exploInteractionStateQuestion = stateFactory.extend(Question, function() {}, function() {});

    exploInteractionStateQuestion.prototype.initForm = function() {

        var _widget = this.widget,
            Sform = _widget.$form,
            interaction = _widget.element,
            response = interaction.getResponseDeclaration(),
            jsonpath = "http://www.wiquid.fr/depp/jpson/data.json",
            config = interaction.properties;

        //render the form using the form template
        Sform.html(formTpl({
            serial: response.serial,
            jsonpath: jsonpath,
            identifier: interaction.attr('responseIdentifier')
        }));

        // -------------------------------------------
        //init form javascript
        formElement.initWidget(Sform);

        Sform.find(".jsonImport").on("change", function(event) {
            var uploadedFile = event.target.files[0];
            if (uploadedFile) {
                var readFile = new FileReader();
                readFile.onload = function(e) {
                    var contents = e.target.result;
                    interaction.prop('data', contents); //
                    interaction.triggerPci('jsonImporterChange', [contents]);
                };
                readFile.readAsText(uploadedFile);
            } else {
                alert("Failed to load file");
            }

        });

        interaction.onPci('scriptSaverChange', function(value) {
            interaction.prop('data', value);
        });

        Sform.find(".saveExploState").on("click", function(event) {
            console.log("Saving...")
            interaction.triggerPci('saveStateChange');

        })

        /* interaction.properties = config 
        Pour récup : interaction.properties.data.mapFile 
        */
        //init data change callbacks
        formElement.setChangeCallbacks(Sform, interaction, {
            jsonpath: function jsonpath(interaction, value) {

                //update the pci property value:
                interaction.prop('jsonpath', value);

                //trigger change event:
                interaction.triggerPci('jsonpathchange', [parseInt(value)]);
            },
            identifier: function(i, value) {
                response.id(value);
                interaction.attr('responseIdentifier', value);
            }
        });

    };


    return exploInteractionStateQuestion;
});