/*
Copyright 2023 -  DEPP - Ministère de l'éducation nationale France.
Developer : Jean-Philippe Rivière - Wiquid
www.wiquid.fr

Conception : Jean-Philippe Rivière - Saskia Keskpaik (DEPP) - Thierry Rocher.


The base development structure was build by Wiquid's PCI Generator for TAO platform Free to use : www.wiquid.fr/pcigen 
This project use open source libraries : jstree, datatable, font-awesome, jQuery, Bootstap
 */

define(['exploPCI/interaction/runtime/js/labo/pathLine',
    'exploPCI/interaction/runtime/js/labo/eventTracker',
    'exploPCI/interaction/runtime/js/labo/dnd',
    'exploPCI/interaction/runtime/js/labo/util',
    'exploPCI/interaction/runtime/js/labo/free'
], function(pathLine, evt, dnd, util, free) {

    function displayDirContent($container, config, activDir, $fileList, $tree, mapFile) {

        var treeFolder = $tree.tfolder;
        //console.log(treeFolder)

        var dirData = $tree.jstree("get_children_dom", activDir),
            exto, iconExt, labelExt, fileId, dataMod, dataCreat, orginalPath, incrementor = 1; // for files only

        for (var i = 0; i < treeFolder.length; i++) {
            if (treeFolder[i].parent == activDir) {};
        }

        /** Update the path with the activ node path. */
        pathLine.display($container, $tree, activDir);

        /**Table Reset */
        $fileList
            .clear()
            .draw();

        /**Select type to display the right tables structure */
        if ($tree.jstree("get_selected", true)[0]) {

            if ($tree.jstree("get_selected", true)[0].type == 'root') {
                volumeDisplayer();
                $fileList.column(1).header().innerText = "Lecteurs";
                $fileList.column(3).header().innerText = "Description";
                $fileList.column(4).header().innerText = "Capacités";
                $fileList.column(5).header().innerText = "Espace libre";
                $fileList.column(6).visible(false, false);
                $fileList.column(2).visible(true, false);
                $fileList.column(5).visible(true, false);

            } else if ($tree.jstree("get_selected", true)[0].type == 'bin') {
                folderDisplayer();
                $fileList.column(1).header().innerText = "Nom";
                $fileList.column(2).header().innerText = "Date de suppression";
                $fileList.column(6).visible(false, false);
                $fileList.column(2).visible(true, false);
                $fileList.column(5).visible(true, false);


            } else if ($tree.jstree("get_selected", true)[0].type == 'netWork') {
                folderDisplayer();
                $fileList.column(6).visible(false, false);
                $fileList.column(2).visible(true, false);
                $fileList.column(5).visible(true, false);

            } else if ($tree.jstree("get_selected", true)[0].id == 'searchResult') {
                folderDisplayer();
                $fileList.column(1).header().innerText = "Nom";
                $fileList.column(2).header().innerText = "Date de Modification";
                $fileList.column(3).header().innerText = "Type";
                $fileList.column(4).header().innerText = "Taille";
                $fileList.column(2).visible(false, false);
                $fileList.column(5).visible(false, false);
                $fileList.column(6).visible(true, false);


            } else {
                folderDisplayer();
                $fileList.column(1).header().innerText = "Nom";
                $fileList.column(2).header().innerText = "Date de Modification";
                $fileList.column(3).header().innerText = "Type";
                $fileList.column(4).header().innerText = "Taille";
                $fileList.column(5).header().innerText = "Date de Création";
                $fileList.column(2).visible(true, false);
                $fileList.column(5).visible(true, false);
                $fileList.column(6).visible(false, false);
            }
        }


        /**Display Folder List */
        function folderDisplayer() {
            var originalPath = "",
                testDirEmpty,
                rowFolder;

            /* console.log($fileList)
            console.log($tree.jstree().get_node(activDir[0]).children)
            console.log(dirData) */

            if (typeof $tree.jstree().get_node(activDir[0]).children !== "undefined") {
                testDirEmpty = $tree.jstree().get_node(activDir[0]).children.length;
            } else {
                testDirEmpty = -1
            }


            if (dirData.length == 0 && testDirEmpty > 0) {
                //alert("INCIDENT")
                console.log("CAS ERREUR JSTREE CORRIGEE")
                    //console.log(activDir)
                $tree.jstree().open_all(activDir)
                dirData = $tree.jstree("get_children_dom", activDir)


            }


            for (var i = 0; i < dirData.length; i++) {
                if ($tree.jstree(true).get_node(dirData[i].id).parent == "searchResult") {
                    originalPath = $tree.jstree(true).get_path(util.getOriginalPath(treeFolder, dirData[i].id));
                    originalPath.shift();
                    originalPath = originalPath.join('/');
                }
                rowFolder = $fileList.row.add([
                    dirData[i].id,
                    "<span class='secretId'>" + dirData[i].id + "</span><div class = 'preIcon ico_folder'></div>" + $tree.jstree(true).get_node(dirData[i].id).text,
                    "<span class = 'hide' >" + dataMod + "</span>" + util.euroDate($tree.jstree(true).get_node(dirData[i].id).data.dateMod),
                    $tree.jstree(true).get_node(dirData[i].id).data.type,
                    $tree.jstree(true).get_node(dirData[i].id).taille,
                    "<span class = 'hide' >" + dataMod + "</span>" + util.euroDate($tree.jstree(true).get_node(dirData[i].id).data.dateCreat),
                    originalPath
                ]).draw().node();

                $container.find(rowFolder).attr({
                    "draggable": true
                });
                $container.find(rowFolder).attr({
                    "title": "Vous pouvez déplacer cet élément avec la souris."
                });
                $container.find(rowFolder).attr('data', dirData[i].id); // Put the ID file on the row in the data attribute
                $container.find(rowFolder).addClass('dropZone');
                $container.find(".jstree-node").addClass('treeDropZone');
            }

        }

        /** Display volume list from root*/
        function volumeDisplayer() {
            //console.log(mapFile)
            for (var i = 0; i < dirData.length; i++) {
                $fileList.row.add([
                    dirData[i].id,
                    "<div class='preIcon " + util.getVolType($tree.jstree(true).get_node(dirData[i].id).type) + "'></div>" + $tree.jstree(true).get_node(dirData[i].id).text,
                    "<span class='hide' >" + dataMod + "</span>" + util.euroDate($tree.jstree(true).get_node(dirData[i].id).data.dateMod),
                    $tree.jstree(true).get_node(dirData[i].id).data.type,
                    util.byte($tree.jstree(true).get_node(dirData[i].id).data.capacity),
                    util.byte(free.freeSpace(treeFolder, mapFile, $tree, $tree.jstree(true).get_node(dirData[i].id)))
                ]).draw();
            }
        }
        /**Display file List */
        for (var index = 0; index < mapFile.length; index++) {
            exto = mapFile[index].extension;
            iconExt = util.getIconExt(exto);
            labelExt = util.getLabelExt(mapFile[index].extension);
            fileId = mapFile[index].fileId;
            dataMod = mapFile[index].dateMod;
            dataCreat = mapFile[index].dateCreat;
            orginalPath = "-";

            if (mapFile[index].node == activDir) {

                if (activDir == 'searchResult') {
                    orginalPath = mapFile[index].originalPath;
                    orginalPath = $tree.jstree(true).get_path(orginalPath);
                    orginalPath.shift();
                    orginalPath = orginalPath.join('/');
                }

                var rowFile = $fileList.row.add([
                    fileId,
                    "<div class = 'preIcon " + iconExt + "'></div><div class='elementNameExt'>" + mapFile[index].name + exto + "</div>",
                    "<span class = 'hide' >" + dataMod + "</span>" + util.euroDate(dataMod),
                    labelExt,
                    util.byte(mapFile[index].size),
                    "<span class = 'hide' >" + dataCreat + "</span>" + util.euroDate(dataCreat),
                    orginalPath
                ]).draw().node();
                $container.find(rowFile).attr('draggable', true); // All Rows are draggable for Chrome
                $container.find(rowFile).attr('data', fileId); // Put the ID file on the row
            }
        }

        // ******************Drag & drop List element table row **************   
        $container.find("tr").on('dragstart drag', function(event) {
            $tree.jstree(true).ctrDrag = false;
            //Create a selection list storend in the dragg Event to be passed to the drop event.
            var selection = $fileList.rows('.selected').data();
            if (selection.length == 0) {
                alert("Attention aucun élément de la liste n'est sélectionné. Veillez à manipuler une/des lignes grisée(s), cliquez sur une ligne ou sélectionnez plusieurs élément Shift+click pour utiliser le glissé/déposé.");
                return false
            } else {
                event.originalEvent.dataTransfer.setData("selection", selection);
                event.data = selection;
                var rowData = dnd.dragFF($container, config, treeFolder, mapFile, $fileList, event);
                if (typeof rowData !== "undefined") {
                    event.originalEvent.dataTransfer.dropEffect = "move"
                    event.originalEvent.dataTransfer.setData("id", rowData[0]);
                    event.originalEvent.dataTransfer.setData("name", rowData[1]);
                    event.originalEvent.dataTransfer.setData("type", rowData[2]);
                } else {
                    return
                }
            }


        });
        $container.find(".dropZone").on('dragover', function(event) {
            event.preventDefault();
            event.stopPropagation();
            $container.find(this).addClass('dragging');
        });


        $container.find(".dropZone").on('drop', function(event) {
            event.preventDefault();
            event.stopPropagation();
            dnd.drop($container, config, treeFolder, mapFile, $tree, $fileList, incrementor, event);
            $tree.jstree().open_all(activDir)

        });


        $container.find(".jstree-node").on('drop', function(event) {
            event.preventDefault();
            event.stopPropagation();
            /* var El2Move = {
             id: event.originalEvent.dataTransfer.getData("id"),
             name: event.originalEvent.dataTransfer.getData("name"),
             type:event.originalEvent.dataTransfer.getData("type")
            } */
            dnd.drop($container, config, treeFolder, mapFile, $tree, $fileList, incrementor, event);
            $tree.jstree('deselect_all');
            $tree.jstree('select_node', event.currentTarget.id);
            $fileList.draw();

        });


        //}

        //***************End Drag and Drop*****************************    

        /** Control background color for list of files and folders */
        $container.find("tbody").css({
            'background-color': '#fffdf9'
        });

    }

    return {
        now: function($container, config, activDir, $fileList, $tree, mapFile) {
            displayDirContent($container, config, activDir, $fileList, $tree, mapFile);
        }
    };

});
//end Main function