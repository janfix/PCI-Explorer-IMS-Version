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
    'exploPCI/interaction/runtime/js/core/displayDirContent',
    'exploPCI/interaction/runtime/js/labo/eventTracker'
], function(displayDirContent, ev) {
    'use strict';

    var searchResultArr = []; // reset befor sending research

    function searchElement($container, treeFolder, mapFile, $tree, el, startSearchId) {
        var folderChildren = [];
        var folderChildrenID = [];
        $tree.jstree(true).open_all(startSearchId);
        // jstree send bad formated results -> need to clean the children foldernames
        var children = $tree.jstree("get_children_dom", startSearchId);

        for (var i = 0; i < children.length; i++) {
            var cleanChildren = reorganizeChildren(children[i].innerText);
            for (var z = 0; z < cleanChildren.length; z++) {
                folderChildren.push(cleanChildren[z]);
            }
        }

        for (var u = 0; u < treeFolder.length; u++) {
            for (var x = 0; x < folderChildren.length; x++) {
                if (treeFolder[u].text == folderChildren[x]) {
                    if (folderChildrenID.indexOf(treeFolder[u].id) === -1) {
                        folderChildrenID.push(treeFolder[u].id)
                    }
                }
            }
        }

        baseSearchFile();


        function baseSearchFile() {
            folderChildrenID.push(startSearchId);
            //Search files in the base and sub directory
            for (var i = 0; i < mapFile.length; i++) {
                //Check in reduced number of folder 
                for (var ci = 0; ci < folderChildrenID.length; ci++) {
                    if (folderChildrenID[ci] == mapFile[i].node) {
                        //First everything to lowerCase then compare.
                        var childrenNameLC = mapFile[i].name.toLowerCase();
                        var childrenExtLC = mapFile[i].extension.toLowerCase();
                        var elLC = el.toLowerCase();
                        var searchTestName = childrenNameLC.search(elLC);
                        var searchTestExt = childrenExtLC.search(elLC);
                        if (searchTestName >= 0 || searchTestExt >= 0) {
                            var newId = mapFile.length + 1;
                            var newEl = {
                                'fileId': newId,
                                'node': 'searchResult',
                                'name': mapFile[i].name,
                                'extension': mapFile[i].extension,
                                'size': mapFile[i].size,
                                'dateMod': mapFile[i].dateMod,
                                'dateCreat': mapFile[i].dateCreat,
                                'app': mapFile[i].app,
                                'image_url': mapFile[i].image_url,
                                'dateLastAcces': mapFile[i].dateLastAcces,
                                'author': mapFile[i].author,
                                'content': mapFile[i].content,
                                'originalPath': mapFile[i].node,
                                'originalID': mapFile[i].fileId
                            };
                            mapFile.push(newEl);
                        }
                    }
                }
            }

        }

        baseSearchFolder(folderChildren);
        /**
         * Compare search string to foldernames
         * @param {array} folderChildren 
         */
        function baseSearchFolder(folderChildren) {
            var childrenNameLC, elLC, searchTest, scanRsFolder = [],
                scanRsFolderID = [],
                scanresult;

            for (var i = 0; i < folderChildren.length; i++) {
                // Everything to lowerCase
                childrenNameLC = folderChildren[i].toLowerCase();
                elLC = el.toLowerCase();
                // Check if key search is in name folder
                searchTest = childrenNameLC.search(elLC);
                if (searchTest >= 0) {
                    scanRsFolder.push(folderChildren[i])
                }
            }

            // Find id from names for each element of scanRsfolder
            for (var a = 0; a < scanRsFolder.length; a++) {
                for (var wi = 0; wi < treeFolder.length; wi++) {
                    if (treeFolder[wi].text == scanRsFolder[a]) {
                        if (scanRsFolderID.indexOf(treeFolder[wi].id) === -1) {
                            scanRsFolderID.push(treeFolder[wi].id)
                        }
                    };
                }
            }

            for (var b = 0; b < scanRsFolderID.length; b++) {
                var pathSearchedfolder = $tree.jstree().get_path(scanRsFolderID[b]);
                var newSearchName = "";
                for (var s = 1; s < pathSearchedfolder.length; s++) {
                    var newSearchName = newSearchName + pathSearchedfolder[s] + "/";
                }
                var originalNode = $tree.jstree(true).get_node(scanRsFolderID[b]);
                $tree.jstree(true).ctrDrag = false;
                var copyOfNode = $tree.jstree(true).copy_node(scanRsFolderID[b], 'searchResult');
                console.log(copyOfNode)
                var copyObj = $tree.jstree(true).get_node(copyOfNode);
                console.log(copyObj)
                $tree.jstree().rename_node(copyOfNode, newSearchName);

                copyObj.data = [];

                copyObj.data.type = originalNode.data.type;
                copyObj.data.dateMod = originalNode.data.dateMod;
                copyObj.data.dateCreat = originalNode.data.dateCreat;
                copyObj.data.originalPath = originalNode.parent;

                treeFolder.push({
                    "id": copyOfNode,
                    "parent": "searchResult",
                    "text": newSearchName,
                    "type": copyObj.type,
                    "data": {
                        "type": originalNode.data.type,
                        "dateMod": originalNode.data.dateMod,
                        "dateCreat": originalNode.data.dateCreat,
                        'originalPath': originalNode.parent
                    }
                });
            }
            return searchResultArr;
        } //end of baseSearchFolder


        /**
         * Jstree list of children need to be reformated.
         * Each element of the children array must be inspected and reformated then sent back to the bellow function. 
         * @param {*} childBrut 
         */
        function reorganizeChildren(childBrut) {
            var subtstring = childBrut.split("\n");
            var result = [];
            for (var i = 0; i < subtstring.length; i++) {
                if (subtstring[i] !== " ") {
                    result.push(subtstring[i]);
                }
            }
            return result;
        }

    }

    function cleanSearch(treeFolder, mapFile, $tree, $container, config, activDir, $fileList) {
        for (var i = 0; i < treeFolder.length; i++) {
            if (treeFolder[i].parent == 'searchResult') {
                $tree.jstree(true).delete_node(treeFolder[i].id);
            };
        }
        for (var y = 0; y < mapFile.length; y++) {
            if (mapFile[y].node == 'searchResult') {
                mapFile[y].node = 'archivSearch'; //All the files searched are archived
                displayDirContent.now($container, config, activDir, $fileList, $tree, mapFile);
            }

        }

    }


    /**
     * Jstree list of children must be reformated.
     * Each element of the children array must be inspected and reformated then sent back to the bellow function. 
     * @param {*} childBrut 
     */
    function reorganizeChildren(childBrut) {
        var subtstring = childBrut.split("\n");
        var result = [];
        for (var i = 0; i < subtstring.length; i++) {
            if (subtstring[i] !== " ") {
                result.push(subtstring[i]);
            }
        }
        return result;
    }



    return {
        element: function($container, treeFolder, mapFile, $tree, el, startSearchId) {
            searchElement($container, treeFolder, mapFile, $tree, el, startSearchId);
        },
        clean: function(treeFolder, mapFile, $tree, $container, config, activDir, $fileList) {
            cleanSearch(treeFolder, mapFile, $tree, $container, config, activDir, $fileList);
        }
    };

});
//end Main function