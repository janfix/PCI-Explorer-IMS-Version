/*
Copyright 2020 -  DEPP - Ministère de l'éducation nationale France.
Developer : Jean-Philippe Rivière - Wiquid
www.wiquid.fr

Conception : Jean-Philippe Rivière - Saskia Keskpaik (DEPP) - Thierry Rocher.
Code Review : Sam Sipasseuth from OAT.

The base development structure was build by Wiquid's PCI Generator for TAO platform Free to use : www.wiquid.fr/pcigen 
This project use open source libraries : jstree, datatable, font-awesome, jQuery, Bootstap
 */

define(['exploPCI/interaction/runtime/js/labo/eventTracker'

], function(ev) {

    function copy($container, config, treeFolder, mapFile, $tree, $fileList, WbranchSize, selectedId) {
        var evName, clipBoard = [],
            copyNodes;



        function addCopyToJson(neoNode, DirId, parentDir, TFolder) {
            neoNode.data = {};
            neoNode.data.type = TFolder.data.type;
            neoNode.data.dateMod = TFolder.data.dateMod;
            neoNode.data.dateCreat = TFolder.data.dateCreat;

            treeFolder.push({
                "id": DirId,
                "parent": parentDir,
                "text": TFolder.text,
                "type": TFolder.type,
                "data": {
                    "copy": TFolder.id,
                    "type": TFolder.data.type,
                    "dateMod": TFolder.data.dateMod,
                    "dateCreat": TFolder.data.dateCreat
                }
            });
        }

        /**
         *Build an array of direct children for the node in copy 
         * @param {obj} baseTree - the node being copied
         * @returns {obj} ChildNodeArr - the array of copied node + direct children
         */
        function findOriginal(baseTree) {
            var ChildNodeArr = []
            var baseNode = $tree.jstree(true).get_node(baseTree.id);
            for (var i = 0; i < baseNode.children_d.length; i++) {
                var nChild = $tree.jstree(true).get_node(baseNode.children_d[i]);
                ChildNodeArr.push(nChild);
            }
            return ChildNodeArr;
        }

        // Action starts from Tree
        if (selectedId) {
            copyNodes = $tree.jstree(true).get_selected(); // get only ids of nodes

            //console.log(selectedId)
            WbranchSize = ev.branchSize($tree, mapFile, selectedId);

            for (var x = 0; x < copyNodes.length; x++) {
                // add branch weight
                var newNode = $tree.jstree().copy_node(copyNodes[x], 'clipboard');
                var newNodeData = $tree.jstree().get_node(newNode);

                for (var i = 0; i < treeFolder.length; i++) {
                    if (treeFolder[i].id == copyNodes[x]) {
                        console.log("ACTJ1")
                        console.log(treeFolder[i])
                        addCopyToJson(newNodeData, newNode, "clipboard", treeFolder[i]);

                        // Update Children in Json
                        childGroup = newNodeData.children_d;
                        for (var y = 0; y < childGroup.length; y++) {
                            var newChild = $tree.jstree(true).get_node(childGroup[y]);
                            var newChildDir = childGroup[y];
                            var parentDir = newChild.parent;
                            var CNodeOriginal = findOriginal(treeFolder[i], newChild.text);

                            for (var x = 0; x < CNodeOriginal.length; x++) {
                                if (CNodeOriginal[x].text == newChild.text) {
                                    console.log("ACTJ2")
                                    addCopyToJson(newChild, newChildDir, parentDir, CNodeOriginal[x]);
                                }
                            }
                        }
                    }
                }
                //dataFolder();
                ev.storeMapFile($container, config, mapFile);
                evName = "Mcontextuel - copie de répertoire";
                ev.collector($container, evName, copyNodes[x], null)
            }
            //Action starts from list
        } else {
            // console.log("Copy from List")
            SelectedArr = $fileList.rows({
                selected: true
            })[0];
            for (var index = 0; index < SelectedArr.length; index++) {
                var indexElement = SelectedArr[index];
                var newId = mapFile.length + 1;
                var element = $fileList.row(indexElement).data();
                var childGroup;

                // get only files id... no directories !
                for (var i = 0; i < mapFile.length; i++) {
                    var idf = mapFile[i];
                    if (idf.fileId == element[0]) {
                        var newEl = {
                            'fileId': newId,
                            'node': 'clipBoard',
                            'name': idf.name,
                            'extension': idf.extension,
                            'size': idf.size,
                            'dateMod': idf.dateMod,
                            'dateCreat': idf.dateCreat,
                            "image_url": idf.image_url,
                            "app": idf.app,
                            "dateLastAcces": idf.dateLastAcces,
                            "author": idf.author,
                            "content": idf.content,
                            'origin': idf.node,
                            'copy': true
                        };
                        clipBoard.push(newEl);
                        ev.storeClipBoard($container, clipBoard);
                        ev.storeMapFile($container, config, mapFile);
                        evName = "Mcontextuel - Copier fichier";
                        ev.collector($container, evName, mapFile[i].name + mapFile[i].extension, ev.getDirName(mapFile[i].node, treeFolder));
                    }
                }
                // Second for loop to get directories
                for (var i = 0; i < treeFolder.length; i++) {
                    if (treeFolder[i].id == element[0]) {
                        // Add to  treeFolder the new folder with new ID
                        console.log($tree.jstree(true).ctrDrag)
                        $tree.jstree(true).ctrDrag = false;
                        //$tree.jstree(true).settings.core.check_callback.drag = false; //Over write the check_CallBack
                        var newDir = $tree.jstree(true).copy_node($tree.jstree(true).get_node(treeFolder[i].id), $tree.jstree(true).get_node('clipboard')); // copy and pass ID
                        var newNode = $tree.jstree(true).get_node(newDir);
                        console.log(newNode) // The error come from here : newNode = false !! Because of the callback
                        WbranchSize = ev.branchSize($tree, mapFile, element[0]);
                        console.log("ACTJ3");

                        addCopyToJson(newNode, newDir, "clipboard", treeFolder[i]);


                        // treeFolder[i].parent = "clipboard";
                        $tree.jstree(true).get_node(newDir).data.dateMod = treeFolder[i].data.dateMod;
                        $tree.jstree(true).get_node(newDir).data.type = treeFolder[i].data.type;
                        $tree.jstree(true).get_node(newDir).taille = ""
                        $tree.jstree(true).get_node(newDir).data.dateCreat = treeFolder[i].data.dateCreat;


                        // Update Children in Json
                        childGroup = newNode.children_d;
                        if (childGroup.length > 0) {
                            for (var y = 0; y < childGroup.length; y++) {
                                var newChild = $tree.jstree(true).get_node(childGroup[y]);
                                var newChildDir = childGroup[y];
                                var parentDir = newChild.parent;
                                var CNodeOriginal = findOriginal(treeFolder[i], newChild.text);
                                for (var x = 0; x < CNodeOriginal.length; x++) {
                                    if (CNodeOriginal[x].text == newChild.text) {
                                        console.log("ACTJ4")
                                        addCopyToJson(newChild, newChildDir, parentDir, CNodeOriginal[x]);
                                    }
                                }
                                ev.storeClipBoard($container, clipBoard);
                                ev.storeMapFolder($container, treeFolder);
                                ev.storeMapFile($container, mapFile);
                                evName = "Mcontextuel - Copier répertoire";
                                ev.collector($container, evName, childGroup[y], 'to clipBoard');
                            }
                        }


                    }
                }

            }
        }


        //return WbranchSize;
        return clipBoard;
    }

    return {
        copy: function($container, config, treeFolder, mapFile, $tree, $fileList, WbranchSize, selectedId) {
            var Wbranch = copy($container, config, treeFolder, mapFile, $tree, $fileList, WbranchSize, selectedId);
            return Wbranch;
        }
    };

});
//end Main function