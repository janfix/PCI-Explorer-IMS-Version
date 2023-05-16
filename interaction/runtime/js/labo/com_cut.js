/*
Copyright 2019 -  DEPP - Ministère de l'éducation nationale France.
Developer : Jean-Philippe Rivière - Wiquid
www.wiquid.fr

Conception : Jean-Philippe Rivière - Saskia Keskpaik (DEPP) - Thierry Rocher.
Code Review : Sam Sipasseuth from OAT.

The base development structure was build by Wiquid's PCI Generator for TAO platform Free to use : www.wiquid.fr/pcigen 
This project use open source libraries : jstree, datatable, font-awesome, jQuery, Bootstap
 */

define(['exploPCI/interaction/runtime/js/labo/eventTracker'], function(ev) {


    function commandCut($container, config, treeFolder, mapFile, $tree, $fileList, WbranchSize, selectedNodeId) {
        var evName, originalNodes, clipBoard = [];
        if (selectedNodeId) {
            console.log($tree.jstree(true).ctrDrag)
            originalNodes = $tree.jstree(true).get_selected(selectedNodeId);
            $tree.jstree(true).ctrDrag = false;
            for (var x = 0; x < originalNodes.length; x++) {
                WbranchSize = ev.branchSize($tree, mapFile, originalNodes[x].id);

                $tree.jstree().move_node(originalNodes[x].id, 'clipboard');

                var oriNodeId = originalNodes[x].id;
                for (var i = 0; i < treeFolder.length; i++) {
                    var idfold = treeFolder[i];
                    if (idfold.id == oriNodeId) {
                        treeFolder[i].parent = "clipBoard";
                        ev.storeMapFolder($container, treeFolder);
                        ev.storeMapFile($container, mapFile);
                        evName = "Mcontextuel - Couper répertoire";
                        ev.collector($container, evName, treeFolder[i].text, ev.getDirName(oriNodeId, treeFolder));
                    }
                }
            }

        } else {
            SelectedArr = $fileList.rows({
                selected: true
            })[0];
            for (var index = 0; index < SelectedArr.length; index++) {
                var indexElement = SelectedArr[index];
                var element = $fileList.row(indexElement).data();
                for (var i = 0; i < mapFile.length; i++) {
                    if (element[0] == mapFile[i].fileId) {
                        clipBoard.push(mapFile[i]);
                        ev.storeMapFile($container, config, mapFile);
                    };
                }

                // get only files id no directories !
                for (var i = 0; i < mapFile.length; i++) {

                    if (mapFile[i].fileId == element[0]) {
                        var oriNodeId = mapFile[i].node;
                        mapFile[i].origin = mapFile[i].node;
                        mapFile[i].node = "clipBoard";
                        evName = "Mcontextuel - Couper fichier";
                        ev.collector($container, evName, mapFile[i].name + mapFile[i].extension, ev.getDirName(oriNodeId, treeFolder));
                        ev.storeMapFile($container, config, mapFile);
                    }
                }
                // Second for loop to get directories
                for (var i = 0; i < treeFolder.length; i++) {
                    if (treeFolder[i].id == element[0]) {
                        WbranchSize = ev.branchSize($tree, mapFile, element[0]);
                        var oriNodeId = treeFolder[i].parent;
                        treeFolder[i].origin = oriNodeId;
                        treeFolder[i].parent = "clipBoard";
                        $tree.jstree().move_node(treeFolder[i].id, 'clipboard');

                        $tree.jstree(true).select_node(oriNodeId);
                        $tree.jstree(true).open_node(oriNodeId);

                        ev.storeMapFolder($container, treeFolder);
                        evName = "Mcontextuel - Couper répertoire";
                        ev.collector($container, evName, treeFolder[i].text, ev.getDirName(oriNodeId, treeFolder));
                    }
                }
            }
        }
        $fileList.rows('.selected').remove().draw(); // Remove row from tables
        //console.log(WbranchSize);

        //return WbranchSize;
        return clipBoard;

    }

    return {
        cut: function($container, config, treeFolder, mapFile, $tree, $fileList, WbranchSize, selectedNodeId) {
            var Wbranch = commandCut($container, config, treeFolder, mapFile, $tree, $fileList, WbranchSize, selectedNodeId);
            return Wbranch;

        }
    };

});
//end Main function