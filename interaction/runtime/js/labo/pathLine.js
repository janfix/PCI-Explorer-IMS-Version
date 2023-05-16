/*
Copyright 2019 -  DEPP - Ministère de l'éducation nationale France.
Developer : Jean-Philippe Rivière - Wiquid
www.wiquid.fr

Conception : Jean-Philippe Rivière - Saskia Keskpaik (DEPP) - Thierry Rocher.
Code Review : Sam Sipasseuth from OAT.

The base development structure was build by Wiquid's PCI Generator for TAO platform Free to use : www.wiquid.fr/pcigen 
This project use open source libraries : jstree, datatable, font-awesome, jQuery, Bootstap
 */

define([], function () {

    function initPathLine($container) {
        
        var pathLine = '<div class="preIconPath"></div> <div class="pathLine">Loading...</div><div title="cliquez pour lancer la recherche" class="magnify"></div><input class="searchInput" type="text" placeholder="Rechercher fichier ou dossier"> ';
        $container.find(".path").html(pathLine);
    }

    function pathDisplay($container, $tree, dirActiv) {
        var pathArray = $tree.jstree("get_path", dirActiv);
        var pathIdArray = $tree.jstree("get_path", dirActiv, '/', true);
        var pathStrg = "";

        if (pathIdArray) {
            pathIdArray = pathIdArray.split("/");
        }

        for (var i = 0; i < pathArray.length; i++) {
            var element = pathArray[i];
            pathStrg = pathStrg + '/ <a href="#" class="pathElement" name = "' + pathIdArray[i] + '">' + element + '</a>';
        }
        $container.find(".pathLine").html(pathStrg);
        $container.find(".pathElement").click(function () {
            var nodeId = $container.find(this).attr('name');
            $tree.jstree("deselect_all");
            $tree.jstree('select_node', nodeId);
            $tree.jstree('open_node', nodeId);
        });
    }

    return {
        init: function ($container) {
            initPathLine($container);
        }, 
        display: function ($container, $tree,  dirActiv) {
            pathDisplay($container, $tree,  dirActiv);
        }
    };

});
//end Main function