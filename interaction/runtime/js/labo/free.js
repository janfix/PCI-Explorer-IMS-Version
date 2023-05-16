/*
Copyright 2019 -  DEPP - Ministère de l'éducation nationale France.
Developer : Jean-Philippe Rivière - Wiquid
www.wiquid.fr

Conception : Jean-Philippe Rivière - Saskia Keskpaik (DEPP) - Thierry Rocher.
Code Review : Sam Sipasseuth from OAT.

The base development structure was build by Wiquid's PCI Generator for TAO platform Free to use : www.wiquid.fr/pcigen 
This project use open source libraries : jstree, datatable, font-awesome, jQuery, Bootstap
 */

define(['exploPCI/interaction/runtime/js/labo/eventTracker'], function (ev) {


    function fSpace(treeFolder, mapFile, $tree, vol) {
        var freeSpace = 0,
            occSpace = 0;

        var ChildArray = [];
        var tNode = $tree.jstree(true).get_node(vol, true)
        ChildArray = getAllChildren($tree, tNode);

        // Add the root to the childArray (capacity of root must be included)
        if (vol) {
            if (ChildArray.indexOf(vol.id) === -1) {
                ChildArray.push(vol.id)
            }

            //need to clean ChildArray (uniq ID)
            var filteredArr = ChildArray.filter(function (item, index) {
                if (ChildArray.indexOf(item) == index)
                    return item;
            });

            ChildArray = filteredArr;

            //For root Volume
            for (var i = 0; i < ChildArray.length; i++) {
                for (var y = 0; y < mapFile.length; y++) {
                    if (mapFile[y].node == ChildArray[i]) {
                        //Calculate the freespace
                        occSpace = occSpace + parseInt(mapFile[y].size);
                    }
                }
            }
            // FreeSpace evaluation
            for (var i = 0; i < treeFolder.length; i++) {
                if (treeFolder[i].id == vol.id) {
                    freeSpace = parseInt(treeFolder[i].data.capacity) - occSpace;
                    treeFolder[i].data.freeSpace = freeSpace;
                }
            }
            return freeSpace;
        } else {
            return 10000000000;
        } // Space is always enough because destination volume = origin volume
    }

    /**
     * Get all children for folders even deep - Input = node object !
     * @param {obj} node 
     */
    function getAllChildren($tree, node) {
        var node_info = $tree.jstree("get_node", node[0]);
        return node_info.children_d;
    }

    function testSpaceFolder(treeFolder, mapFile ,$tree, desti, size) { // ex testFreeSpaceFolder
        var destiNodeId, freespace, rest, tfSpace;
        destiNodeId = getvol(treeFolder, $tree, desti);
        freespace = fSpace(treeFolder, mapFile, $tree, $tree.jstree(true).get_node(destiNodeId));
        rest = freespace - parseInt(size);

        if (rest > 0) {
            tfSpace = true;
        } else {
            tfSpace = false
        }
        return tfSpace;
    }

    /**
     * find the vol for a node
     * @param {obj} node 
     */
    function getvol(treeFolder, $tree, node) {
        var node_info = $tree.jstree("get_node", node);
        if (node_info) {
            //Two cases : normal folders and root folders
            var parents = [];

            if (node_info.data.type == "Volume" || node_info.data.type == "Mémoire Flash" || node_info.data.type == "Mémoire Flash usb") {
                parents.push(node_info.id);
            } else {
                parents = node_info.parents;
            }

            for (var i = 0; i < parents.length; i++) {
                for (var y = 0; y < treeFolder.length; y++) {
                    if (parents[i] == treeFolder[y].id && treeFolder[y].data.type == "Volume" ||
                        parents[i] == treeFolder[y].id && node_info.data.type == "Mémoire Flash" ||
                        parents[i] == treeFolder[y].id && node_info.data.type == "Mémoire Flash usb") {
                        return treeFolder[y].id;
                    }
                }
            }
        }

    }



    return {
        freeSpace: function (treeFolder, mapFile, $tree, vol) {
            var freeSpace = fSpace(treeFolder, mapFile, $tree, vol);
            return freeSpace;
        },
        testSpaceFolder: function (treeFolder, mapFile ,$tree, desti, size) {
            var tfSpace = testSpaceFolder(treeFolder, mapFile ,$tree, desti, size);
            return tfSpace;
        },
        getvol: function (treeFolder, $tree, node) {
            var volnode = getvol(treeFolder, $tree, node);
            return volnode;
        }

    };

});
//end Main function