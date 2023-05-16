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
    'exploPCI/interaction/runtime/js/labo/eventTracker',
    'exploPCI/interaction/runtime/js/core/displayDirContent'
], function(ev, displayDirContent) {


    function trashElement($container, config, treeFolder, mapFile, $tree, $fileList, selectedNodes) {
        var evName, folderToMove = [],
            dirOn;
        /**
         * if selectedNodes is defined : commandtrash was activated from tree context menu
         */
        if (selectedNodes) {
            for (var x = 0; x < selectedNodes.length; x++) {
                var element = selectedNodes[x];

                for (var i = 0; i < treeFolder.length; i++) {
                    var idfold = treeFolder[i];
                    if (idfold.id == element) {
                        treeFolder[i].origin = treeFolder[i].parent;
                        treeFolder[i].parent = "bin";
                        $tree.jstree().move_node(idfold.id, 'bin');
                        evName = "Mcontextuel - Suppression de Répertoire";
                        ev.collector($container, evName, treeFolder[i].text, ev.getDirName(treeFolder[i].origin, treeFolder));
                        ev.storeMapFolder($container, treeFolder);
                    }
                }
            }
        } else { //selectedNodes : the function was called from list context menu
            SelectedArr = $fileList.rows({
                selected: true
            })[0];

            for (var index = 0; index < SelectedArr.length; index++) {
                var element = $fileList.rows('.selected').data()[index];

                if (element[3] == "Répertoire") {
                    var sID = element[0];

                    for (var i = 0; i < treeFolder.length; i++) {
                        if (treeFolder[i].id == sID) {
                            treeFolder[i].origin = treeFolder[i].parent;
                            dirOn = treeFolder[i].parent;
                            treeFolder[i].parent = "bin";
                            folderToMove.push(treeFolder[i].id); //Building array of node index to move later 
                            evName = "Mcontextuel - Suppression de Répertoire vers corbeille";
                            ev.collector($container, evName, treeFolder[i].text, ev.getDirName(treeFolder[i].origin, treeFolder));
                            ev.storeMapFolder($container, treeFolder);
                        }

                    }
                } else {
                    var sID = element[0] - 1;
                    mapFile[sID].origin = mapFile[sID].node;
                    dirOn = mapFile[sID].node;
                    mapFile[sID].node = "bin";
                    evName = "Mcontextuel - Suppression de fichier vers corbeille";
                    ev.collector($container, evName, mapFile[sID].name + mapFile[sID].extension, ev.getDirName(mapFile[sID].origin, treeFolder));
                    ev.storeMapFile($container, mapFile);

                }
            }

            //Moving the folders after changing table
            for (var i = 0; i < folderToMove.length; i++) {
                $tree.jstree().move_node(folderToMove[i], 'bin');
            }
            $tree.jstree(true).select_node(dirOn);
            $tree.jstree(true).open_node(dirOn);

            displayDirContent.now($container, config, dirOn, $fileList, $tree, mapFile);


        }
        $fileList.rows('.selected').remove().draw(); // Remove row from tables


    }

    function emptyTrash($container, config, treeFolder, mapFile, $tree, $fileList) {
        var evName
        confirm("Vous allez vider la corbeille... Les données seront définitivement effacées.");
        var activDir = $tree.jstree(true).get_selected();
        //All elements are moved to the invisible folder Erased
        //Files to Erase
        for (var index = 0; index < mapFile.length; index++) {
            if (mapFile[index].node == "bin") {
                mapFile[index].node = "erased";
                evName = "Mcontextuel - Destruction définitive de fichier";
                ev.collector($container, evName, mapFile[index].name + mapFile[index].extension, ev.getDirName(mapFile[index].origin, treeFolder));
                ev.storeMapFile($container, mapFile);
            }
        }

        //Directories to Erase
        for (var i = 0; i < treeFolder.length; i++) { //Look throught Json Folders 
            if (treeFolder[i].parent == "bin") {
                $tree.jstree().move_node(treeFolder[i].id, "erased");
                treeFolder[i].parent = "erased";
                evName = "Mcontextuel Destruction définitive de répertoire";
                ev.collector($container, evName, treeFolder[i].text, ev.getDirName(treeFolder[i].origin, treeFolder));
                ev.storeMapFolder($container, treeFolder);
            }
        }

        displayDirContent.now($container, config, activDir, $fileList, $tree, mapFile);

        $tree.jstree('open_node', activDir);
    }

    function restoreTrash($container, config, treeFolder, mapFile, $tree, $fileList, treeFolder) {
        var evName;
        var activDir = $tree.jstree(true).get_selected();
        if (activDir == "bin") {
            SelectedArr = $fileList.rows({
                selected: true
            })[0];
            for (var index = 0; index < SelectedArr.length; index++) {
                var indexElement = SelectedArr[index];
                var element = $fileList.row(indexElement).data();
                // get only files id no directories !
                for (var i = 0; i < mapFile.length; i++) {
                    var idf = mapFile[i];
                    if (idf.fileId == element[0]) {
                        mapFile[i].node = mapFile[i].origin;
                        mapFile[i].origin = "bin";
                        evName = "Mcontextuel - Restaurer fichier de la corbeille";
                        ev.collector($container, evName, mapFile[i].name + mapFile[i].extension, ev.getDirName(mapFile[i].node, treeFolder));
                        ev.storeMapFile($container, mapFile);
                    }
                }
                // Second for loop to get directories
                for (var i = 0; i < treeFolder.length; i++) {
                    var idfold = treeFolder[i];
                    if (idfold.id == element[0]) {
                        treeFolder[i].parent = treeFolder[i].origin;
                        treeFolder[i].origin = "bin";
                        //$tree.jstree().hide_node(idfold.id);
                        $tree.jstree().move_node(idfold.id, 'bin');
                        ev.storeMapFolder($container, treeFolder);
                        evName = "Mcontextuel Restauration de répertoire";
                        ev.collector($container, evName, treeFolder[i].text, ev.getDirName(treeFolder[i].parent, treeFolder));

                    }
                }
            }
            $tree.jstree(true).refresh();
        } else {
            $tree.jstree('deselect_all');
            $tree.jstree('select_node', 'bin');
            $tree.jstree('open_node', 'bin');
        }
    }


    return {
        trash: function($container, config, treeFolder, mapFile, clipBoard, $tree, $fileList, selectedNodes) {
            trashElement($container, config, treeFolder, mapFile, clipBoard, $tree, $fileList, selectedNodes);
        },
        empty: function($container, config, treeFolder, mapFile, $tree, $fileList) {
            emptyTrash($container, config, treeFolder, mapFile, $tree, $fileList);
        },
        restore: function($container, config, treeFolder, mapFile, clipBoard, $tree, $fileList) {
            restoreTrash($container, config, treeFolder, mapFile, clipBoard, $tree, $fileList);
        },
    };

});
//end Main function