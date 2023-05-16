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

    function newFolder($container, config, treeFolder, mapFile, $tree, $fileList) {
        //console.log($tree)

        var actifNode = $tree.jstree(true).get_selected(true);
        var newNodeData = {};

        /**
         * Create a new folder : using jstree, update json, update the datatable list, hide the modal window
         */
        function NewFolderCreator(newName) {
            var evName
            newNodeData.text = newName;
            treeFolder.push(newNodeData);

            createNode("#" + actifNode[0].id + "_anchor", newNodeData.id, newNodeData.text, "last");

            $tree.jstree('open_node', actifNode[0].id);

            console.log(newNodeData.id);

            //Update complementary data to jstree
            $tree.jstree(true).get_node(newNodeData.id).data = {};
            $tree.jstree(true).get_node(newNodeData.id).data.dateMod = newNodeData.data.dateMod;
            $tree.jstree(true).get_node(newNodeData.id).data.type = "Répertoire";
            $tree.jstree(true).get_node(newNodeData.id).data.taille = "";
            $tree.jstree(true).get_node(newNodeData.id).data.dateCreat = newNodeData.data.dateCreat;




            ev.storeMapFolder($container, treeFolder);
            evName = "Mcontextuel - Création de répertoire";
            ev.collector($container, evName, newNodeData.text, ev.getDirName(newNodeData.parent, treeFolder));
            $container.find(".modali").hide();
        }


        var actifNode = $tree.jstree(true).get_selected(true);

        if (actifNode[0].id == "cdRom") {
            alert("Il est impossible d'écrire sur ce support")
            $(".modali").hide();
            return
        }

        /**
         * Use jstree to create a new node.
         * @param {obj} parent_node 
         * @param {string} new_node_id 
         * @param {string} new_node_text 
         * @param {val} position 
         */
        function createNode(parent_node, new_node_id, new_node_text, position) {
            $tree.jstree('create_node', $(parent_node), {
                "text": new_node_text,
                "id": new_node_id
            }, position, false, false);
        }

        // Core function     
        newNodeData.id = '_' + Math.random().toString(36).substr(2, 9);
        newNodeData.parent = actifNode[0].id;
        newNodeData.text = "";
        newNodeData.type = "default";
        newNodeData.li_attr = {};
        newNodeData.a_attr = {};
        newNodeData.data = {};
        newNodeData.data.type = "Répertoire";
        newNodeData.data.dateMod = ev.getNowDate();
        newNodeData.data.dateCreat = ev.getNowDate();

        $container.find(".modali").show().css({
            width: "500px",
            height: "140px"
        });
        $container.find('.modalTitle').remove();

        $container.find(".contentModal").html("<h3>Nouveau Répertoire</h3><input class='newFolderInput' type='text' placeholder='Nom du nouveau répertoire'><button class='createNewFolder'>OK</button><button class='annulModal'>Annuler</button>");
        $container.find(".newFolderInput").css("width", "170px").focus();
        $container.find(".annulModal").click(function() {
            $container.find(".modali").hide();
        });
        $container.find(".createNewFolder").click(function() {
            var writable;
            var newName = $container.find(".newFolderInput").val();
            if (newName.length == 0) {
                newName = "nouveau_repertoire_" + (new Date()).getTime();
            };
            var i, crashIt;
            for (i = 0; i < treeFolder.length; i++) {
                if (treeFolder[i].text == newName && treeFolder[i].parent == actifNode[0].id) {
                    crashIt = confirm("Un répertoire porte déjà ce nom à cet endroit ! Désirez-vous l'écraser ? Attention l'ensemble des fichiers et sous-dossiers seront perdus.");
                    if (crashIt) {
                        $tree.jstree().move_node(treeFolder[i].id, 'erased');
                        writable = true;
                        NewFolderCreator(newName);
                        displayDirContent.now($container, config, actifNode[0].id, $fileList, $tree, mapFile);
                        $tree.jstree(true).select_node(actifNode[0].id)
                        return writable;
                    } else {
                        writable = false;
                        $container.find(".modali").hide();
                        return writable;
                    }
                } else {
                    writable = true;
                }
            }
            if (writable == true) {
                console.log("WWWWWW")
                NewFolderCreator(newName);
                displayDirContent.now($container, config, actifNode[0].id, $fileList, $tree, mapFile);
            }
        });


    }


    /**
     * Create new file from context menu 
     * Check if file name is not present in the target directory
     * The size of new file = 0.
     * @param {*} $container 
     * @param {*} treeFolder 
     * @param {*} mapFile 
     * @param {*} $tree 
     */
    function newFile($container, config, treeFolder, mapFile, $tree, $fileList) {
        var evName;
        $container.find(".modali").show().css({
            width: "550px",
            height: "140px"
        });
        $container.find('.modalTitle').remove();
        $container.find(".contentModal").html("<h3>Nouveau Fichier</h3><input class='newFile' type='text' placeholder='Nom du nouveau fichier'>.<input type='text' class='inputExtension' placeholder='Extension'><button class='createNewFile'>OK</button><button class='annulModal'>Annuler</button>");
        $container.find(".newFile").focus();
        $container.find(".annulModal").click(function() {
            $container.find(".modali").hide();
        });
        var actifNode = $tree.jstree(true).get_selected(true);

        if (actifNode[0].id == "cdRom") {
            alert("Il est impossible d'écrire sur ce support")
            $(".modali").hide();
            return
        }

        $container.find('.createNewFile').click(function() {
            var writable;
            var newName = $container.find(".newFile").val();
            var newExt = $container.find(".inputExtension").val();
            for (var i = 0; i < mapFile.length; i++) {
                if (mapFile[i].name == newName && mapFile[i].extension == "." + newExt && mapFile[i].node == actifNode[0].id) {
                    var crashIt = confirm("Un fichier porte déjà ce nom dans ce répertoire ! Désirez-vous l'écraser ?");
                    if (crashIt) {
                        mapFile[i].node = "erased";
                        writable = true;
                    } else {
                        writable = false;
                        return writable;
                    }
                } else {
                    writable = true;
                }
            }
            if (writable == true) {
                mapFile.push({
                    'fileId': mapFile.length + 1,
                    'node': actifNode[0].id,
                    'name': newName,
                    'extension': "." + newExt,
                    'size': '0',
                    'dateMod': ev.getNowDate(),
                    'dateCreat': ev.getNowDate(),
                    'app': "Text Editor",
                    'image_url': "",
                    'dateLastAcces': ev.getNowDate(),
                    'author': "Anonymous",
                    'content': ""
                });

                $tree.jstree('open_node', actifNode[0].id);
                $container.find(".modali").hide();

                //console.log(actifNode[0])

                displayDirContent.now($container, config, actifNode[0].id, $fileList, $tree, mapFile);


                evName = "Mcontextuel - Création de fichier";
                ev.collector($container, evName, newName, ev.getDirName(actifNode[0].id, treeFolder));
                ev.storeMapFile($container, mapFile);
            }
        });


    }

    return {
        folder: function($container, config, treeFolder, mapFile, $tree, $fileList) {
            newFolder($container, config, treeFolder, mapFile, $tree, $fileList);
        },
        file: function($container, config, treeFolder, mapFile, $tree, $fileList) {
            newFile($container, config, treeFolder, mapFile, $tree, $fileList);
        }
    };

});
//end Main function