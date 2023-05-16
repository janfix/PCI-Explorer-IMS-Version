/*
Copyright 2019 -  DEPP - Ministère de l'éducation nationale France.
Developer : Jean-Philippe Rivière - Wiquid
www.wiquid.fr

Conception : Jean-Philippe Rivière - Saskia Keskpaik (DEPP) - Thierry Rocher.
Code Review : Sam Sipasseuth from OAT.

The base development structure was build by Wiquid's PCI Generator for TAO platform Free to use : www.wiquid.fr/pcigen 
This project use open source libraries : jstree, datatable, font-awesome, jQuery, Bootstap
 */

define(['exploPCI/interaction/runtime/js/labo/eventTracker',
    'exploPCI/interaction/runtime/js/labo/verifDbl',
    'exploPCI/interaction/runtime/js/labo/free',
    'exploPCI/interaction/runtime/js/core/displayDirContent'
], function(ev, verifDbl, free, displayDirContent) {


    function paste($container, config, treeFolder, mapFile, clipBoard, $tree, $fileList) {
        /** Get files in clipBoard */
        var clipDir = $tree.jstree(true).get_node('clipboard');
        var destiPaste = $tree.jstree(true).get_selected();
        var evName;
        var incrementor = 1;
        var WbranchSize = 0;

        // console.log(destiPaste[0])

        if (destiPaste[0] == "cdRom") {
            alert("Il est impossible d'écrire sur ce support")
            return
        }

        /**This loop is only for files from copy an cut */
        for (var y = 0; y < clipBoard.length; y++) {
            console.log(clipBoard[y].fileId);
            if (clipBoard[y].fileId) {
                if (clipBoard[y].copy) {
                    if (clipBoard[y].node == "clipBoard") { clipBoard[y].node = destiPaste[0]; }
                    verifDbl.verif(treeFolder, mapFile, $tree, incrementor, clipBoard[y], destiPaste[0], "copy"); //Verify doubles and write in mapFile
                    displayDirContent.now($container, config, destiPaste, $fileList, $tree, mapFile);

                    //Answer system
                    ev.storeClipBoard($container, clipBoard);
                    evName = "Mcontextuel - Coller fichier depuis copier";
                    ev.collector($container, evName, clipBoard[y].name + clipBoard[y].extension, ev.getDirName(destiPaste[0], treeFolder));
                    ev.storeMapFile($container, mapFile);


                    //Reset operation copy
                    for (var i = 0; i < mapFile.length; i++) {
                        if (mapFile[i].fileId == clipBoard[y].fileId) {
                            mapFile[i].copy = false;
                        }
                    }

                    // Refresh Tree to get the list Back
                    //$tree.jstree(true).refresh();
                    $tree.jstree(true).select_node(destiPaste[0]);
                    $tree.jstree(true).open_node(destiPaste[0]);


                } else {

                    for (var i = 0; i < mapFile.length; i++) {
                        if (mapFile[i].fileId == clipBoard[y].fileId) {
                            //console.log("PASTE FROM CUT");
                            verifDbl.verif(treeFolder, mapFile, $tree, incrementor, mapFile[i], destiPaste[0], "cut"); //Verify doubles and write in mapFile
                            evName = "Mcontextuel - Coller fichier depuis couper";
                            ev.collector($container, evName, mapFile[i].name + mapFile[i].extension, ev.getDirName(mapFile[i].node, treeFolder));
                            ev.storeMapFile($container, mapFile);
                        }
                    }
                    displayDirContent.now($container, config, destiPaste, $fileList, $tree, mapFile);
                    // $tree.jstree(true).refresh();
                    $tree.jstree(true).select_node(destiPaste[0]);
                    $tree.jstree(true).open_node(destiPaste[0]);
                }
            }
            displayDirContent.now($container, config, destiPaste, $fileList, $tree, mapFile);
        }

        clipBoard = []; //Empty clipBoard after paste

        //*******************************************Directories********************************************************** */
        /**Move Directories from clipBoard to targetFolder */
        var childArray = clipDir.children; // Get only first direct Child
        var allchildArray = clipDir.children_d;

        for (var ifold = 0; ifold < allchildArray.length; ifold++) { // Scan all directories in childArray
            for (var i = 0; i < treeFolder.length; i++) {
                if (treeFolder[i].id == allchildArray[ifold]) {

                    //console.log(treeFolder[i])
                    //console.log(ev.branchSize($tree, mapFile, treeFolder[i].data.copy))
                    WbranchSize = ev.branchSize($tree, mapFile, treeFolder[i].data.copy) + WbranchSize;
                    //console.log(WbranchSize)

                    var testWritable = verifDbl.verif(treeFolder, mapFile, $tree, incrementor, treeFolder[i], destiPaste[0], 'copy'); // Incertitude sur le message copy

                    for (var j = 0; j < childArray.length; j++) { // Scan all directories in childArray
                        //console.log(WbranchSize);
                        if (free.testSpaceFolder(treeFolder, mapFile, $tree, destiPaste[0], WbranchSize)) {
                            $tree.jstree().move_node(childArray[j], destiPaste[0]); // Move roots of branch (and the branch) from clipboard to destination 
                            displayDirContent.now($container, config, destiPaste, $fileList, $tree, mapFile);
                        } else {
                            alert("Opération impossible, il n'y a pas assez d'espace sur le support de destination");
                            return;
                        }
                    }
                    if (testWritable) {
                        //Repopulate the new folders
                        for (var y = 0; y < treeFolder.length; y++) { // Find the original child in treefolder                          
                            if (treeFolder[y].id == allchildArray[ifold]) {
                                for (var x = 0; x < mapFile.length; x++) { // Scan all files to duplicate to child dir
                                    if (mapFile[x].node == treeFolder[y].data.copy) {
                                        mapFile.push({
                                            'fileId': mapFile.length + 1,
                                            'node': allchildArray[ifold],
                                            'name': mapFile[x].name,
                                            'extension': mapFile[x].extension,
                                            'size': mapFile[x].size,
                                            'dateMod': ev.getNowDate(),
                                            'dateCreat': mapFile[x].dateCreat,
                                            "image_url": mapFile[x].image_url,
                                            "app": mapFile[x].app,
                                            "dateLastAcces": mapFile[x].dateLastAcces,
                                            "author": mapFile[x].author,
                                            "content": mapFile[x].content
                                        });
                                    }
                                }
                            }
                        }

                        //console.log("Correctif22222")
                        displayDirContent.now($container, config, destiPaste[0], $fileList, $tree, mapFile);

                    }

                    ev.storeMapFile($container, mapFile);
                    ev.storeMapFolder($container, treeFolder);
                    evName = "Mcontextuel - Coller répertoire";
                    ev.collector($container, evName, treeFolder[i].text, ev.getDirName(destiPaste[0], treeFolder));
                }
            }
        }
        WbranchSize = 0;
        $tree.jstree(true).select_node(destiPaste[0]);
        $tree.jstree(true).open_node(destiPaste[0]);



    }

    return {
        paste: function($container, config, treeFolder, mapFile, clipBoard, $tree, $fileList) {
            paste($container, config, treeFolder, mapFile, clipBoard, $tree, $fileList);
        }
    };

});
//end Main function