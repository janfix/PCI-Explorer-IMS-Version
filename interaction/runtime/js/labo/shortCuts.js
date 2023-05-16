/*
Copyright 2019 -  DEPP - Ministère de l'éducation nationale France.
Developer : Jean-Philippe Rivière - Wiquid
www.wiquid.fr

Conception : Jean-Philippe Rivière - Saskia Keskpaik (DEPP) - Thierry Rocher.
Code Review : Sam Sipasseuth from OAT.

The base development structure was build by Wiquid's PCI Generator for TAO platform Free to use : www.wiquid.fr/pcigen 
This project use open source libraries : jstree, datatable, font-awesome, jQuery, Bootstap
 */

define([], function() {


    function initQuickAccess($container, treeFolder, $tree) {
        //********************************************************************/
        /** Constitution of ShortCutList ! */
        for (var i = 0; i < treeFolder.length; i++) {
            // Items from ID : unique -> TODO in exploGen (in this version the shorcut list is build on a default model. The user can't build it - )
            if (treeFolder[i].id == "vol1") {
                $container.find(".listItemRapid").html('<li class="rapidLi vol1"><div class="icoHdrive icoRacc"></div><div class="raccVolC">' + treeFolder[i].text + '</div></li>');
            };
            if (treeFolder[i].id == "images") {
                $container.find(".listItemRapid").prepend('<li class = "rapidLi images "><div class="icoPic icoRacc"></div><div class="raccVolC">' + treeFolder[i].text + '</div></li>');
            };
            if (treeFolder[i].id == "videos") {
                $container.find(".listItemRapid").prepend('<li class="rapidLi videos "><div class="icoVideo icoRacc"></div><div class="raccVolC">' + treeFolder[i].text + '</div></li>');
            };
            if (treeFolder[i].id == "documents") {
                $container.find(".listItemRapid").prepend('<li class="rapidLi documents "><div class="icoDocument icoRacc"></div><div class="raccVolC">' + treeFolder[i].text + '</div></li>');
            };
            if (treeFolder[i].id == "downloads") {
                $container.find(".listItemRapid").prepend('<li class="rapidLi downloads "><div class="icoDownload icoRacc"></div><div class="raccVolC">' + treeFolder[i].text + '</div></li>');
            };
        }

        $container.find(".caretDown").html("▽");
        /**listening shortCuts click */
        $container.find(".images").on('click', function() {
            $tree.jstree('deselect_all');
            $tree.jstree('select_node', 'images');

        });

        $container.find(".videos").on('click', function() {
            $tree.jstree('deselect_all');
            $tree.jstree('select_node', 'videos');

        });

        $container.find(".documents").on('click', function() {
            $tree.jstree('deselect_all');
            $tree.jstree('select_node', 'documents');

        });

        $container.find(".downloads").on('click', function() {
            $tree.jstree('deselect_all');
            $tree.jstree('select_node', 'downloads');

        });

        $container.find(".vol1").on('click', function() {
            $tree.jstree('deselect_all');
            $tree.jstree('select_node', 'vol1');
        });


        /**SlideToggle of Quick access link */

        $container.find(".QuickTitle").click(function() {
            $container.find(".listItemRapid").slideToggle();
        });

    }

    return {
        init: function($container, treeFolder, $tree) {
            initQuickAccess($container, treeFolder, $tree);
        }
    };

});
//end Main function