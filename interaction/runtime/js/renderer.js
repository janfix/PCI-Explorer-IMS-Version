/*
Copyright 2019 -  DEPP - Ministère de l'éducation nationale France.
Developer : Jean-Philippe Rivière - Wiquid
www.wiquid.fr

Conception : Jean-Philippe Rivière - Saskia Keskpaik (DEPP) - Thierry Rocher.
Code Review : Sam Sipasseuth from OAT.

The base development structure was build by Wiquid's PCI Generator for TAO platform Free to use : www.wiquid.fr/pcigen 
This project use open source libraries : jstree, datatable, font-awesome, jQuery, Bootstap
 */

define([
        'exploPCI/interaction/runtime/js/lib/datatables', // Contains and extends JQuery
        'exploPCI/interaction/runtime/js/labo/topMenu',
        'exploPCI/interaction/runtime/js/labo/shortCuts',
        'exploPCI/interaction/runtime/js/core/tree',
        'exploPCI/interaction/runtime/js/core/table',
        'exploPCI/interaction/runtime/js/labo/pathLine',
        'exploPCI/interaction/runtime/js/core/displayDirContent',
        'exploPCI/interaction/runtime/js/core/CMenuList',
        'exploPCI/interaction/runtime/js/labo/eventTracker',
        'exploPCI/interaction/runtime/js/labo/search',
        'exploPCI/interaction/runtime/js/labo/free',
        'exploPCI/interaction/runtime/js/labo/util',
        'css!exploPCI/interaction/runtime/css/explorer.css',

    ],
    function($, topMenu, shortCuts, tree, table, pathLine, displayDirContent, CMenuList, evt, search, free, util) {
        'use strict';

        function renderExplo(id, $container, config, assetManager) {

            var UNIQEXPLO = Date.now();
            console.log(typeof UNIQEXPLO)
            var UEX = UNIQEXPLO.toString()
            $container.eventCollector = [];
          

            $container.find(".explo").attr("data-id", UNIQEXPLO);
            $container.find(".explo").addClass(UEX);
            console.log(UNIQEXPLO);
            topMenu.init($container);
            $container.find(".dropdown-toggle").dropdown();


            //APP ZONE -----------------------------------
            pathLine.init($container);
            var $tree = tree.run($container, config).$tree;

            var TableData = table.init($container, config, $tree, $tree.tfolder);
            var $fileList = TableData[0];
            evt.$fileList = $fileList;
            var mapFile = TableData[1];

            $container.find(".dataFiles").html(JSON.stringify(mapFile));

            var treeFolder = $tree.tfolder;
            shortCuts.init($container, treeFolder, $tree);

            //*********************Tree Listening changes**************************/
            $tree.on("changed.jstree", function(event, data) {
                if (data.action == "deselect_all") { $tree.jstree(true).ctrDrag = true; }
                this.dataFiles = mapFile;
                $container.find('.ctxMenu').css("display", "none");
                $container.find(".jstree-node").on('dragover', function(event) { // This is not working ?
                    event.preventDefault();
                    event.stopPropagation();
                    $container.find(this).addClass('dragging');

                });


                /*  $container.find(".jstree-node").on('drop', function (event) {
                     event.preventDefault();
                     event.stopPropagation();
                     console.log(event)
                 }); */
                displayDirContent.now($container, config, data.selected, $fileList, $tree, mapFile);
            });


            $tree.on('dblclick', function(event) {
                event.preventDefault();
                event.stopPropagation();


            });



            //************** Chapter Search ******************

            $container.find(".magnify").on('click', function() {
                var el = $container.find(".searchInput").val(); // element to search
                var startSearchId = $tree.jstree(true).get_selected()[0];
                if (!startSearchId) {
                    startSearchId = 'root';
                }
                if (el) {
                    search.clean(treeFolder, mapFile, $tree, $container, config, startSearchId, $fileList);
                    search.element($container, treeFolder, mapFile, $tree, el, startSearchId);
                    $tree.jstree('deselect_all');
                    $tree.jstree('select_node', "searchResult"); // But remains invisible 
                } else {
                    alert("Préciser votre recherche");
                }
            });



            /* Table - Context Menu */
            CMenuList.init($container, config, treeFolder, mapFile, $tree, $fileList)

            function ConfirmReset() {
                if (confirm("Vous voulez vraiment recommencer? Attention le travail effectué sera effacé !") == true) {
                    location.reload();

                } else {
                    console.log("Annulation");
                }
            }
            $container.find(".totalRestart").on("click", function() {
                ConfirmReset()
            })




            $container.find(".dataGrabber").on("click", function() {
                console.log("FOLDERS");
                console.log("FILES");
                var treeData = $tree.jstree(true).get_json('#', { flat: false });
                var treeDataJSON = JSON.stringify(treeData)
                var jsonTData = JSON.stringify(mapFile);
                $container.find(".dataTree").html(treeDataJSON)
                $container.find(".dataFiles").html(jsonTData)


            });



        }
        // Main function renderExplo end here 

        return {
            render: function(id, container, config, assetManager) {
                var $container = $(container);
                renderExplo(id, $container, config, assetManager);
            }
        };
    });